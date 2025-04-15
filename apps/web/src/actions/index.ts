import { defineAction, ActionError } from 'astro:actions';
import { getFrontmatter, splitFrontmatter } from '@/lib/utils';
import { z } from 'astro:schema';
import { OPENAI_API_KEY } from 'astro:env/server';
import { db } from '@/lib/db';
import { customAlphabet } from 'nanoid';
import slugify from '@sindresorhus/slugify';
import { availableTags } from '@ctxs/util';
import { Post, User, Vote } from '@ctxs/db';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { eq } from 'drizzle-orm';
import { inferGitHubUsername, inferXUsername } from '@/lib/utils';
import yaml from 'js-yaml';
import { sendPushoverNotification } from '@/lib/pushover';
import { triggerWorkflow } from '@/lib/cloudflare';

const generateDisplayId = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyz',
  6
);

type PostMetadata = {
  title: string;
  description: string;
  tags: string[];
  slug: string;
};

const openai = createOpenAI({ apiKey: OPENAI_API_KEY });

type InferredAttributedUsers = {
  attributedGithubUser: string | null;
  attributedXUser: string | null;
};

const inferAttributedUsers = (content: string): InferredAttributedUsers => {
  return {
    attributedGithubUser: inferGitHubUsername(content),
    attributedXUser: inferXUsername(content),
  };
};

const inferSourceUrl = (credit: string): string | null => {
  const url = credit.match(/https?:\/\/[^\s]+/);
  return url ? url[0] : null;
};

const generatePostMetadata = async (content: string): Promise<PostMetadata> => {
  const contentPreview = content.slice(0, 2000);
  const result = await generateObject<PostMetadata>({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      title: z
        .string()
        .describe('A concise, descriptive title for the context window'),
      slug: z.string().describe('a 30 character or less keyword oriented slug'),
      description: z
        .string()
        .describe(
          'A brief summary of what this context window might help with, 120 characters maximum.'
        ),
      tags: z
        .array(z.string())
        .describe(`Relevant tags for categorizing the post. `),
    }),
    prompt: `You are managing a library of context windows and prompts.
     Please generate a title, description, and tags for the following post content:\n\n${contentPreview}.
     The list of valid tags: ${JSON.stringify(availableTags)}
     Only add tags if you are confident that they apply to the post.`,
  });

  return result.object;
};

export const server = {
  createPost: defineAction({
    input: z.object({
      content: z.string(),
      credit: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (context.locals.user?.id) {
        const { frontmatterString, content } = splitFrontmatter(input.content);
        const frontmatter = yaml.load(frontmatterString, {
          schema: yaml.FAILSAFE_SCHEMA,
        });
        const user = await db
          .select({ githubUserName: User.githubUserName })
          .from(User)
          .where(eq(User.id, context.locals.user.id));
        const userSegment = user[0].githubUserName || context.locals.user.id;

        const displayId = generateDisplayId();

        // Generate title, description and tags using OpenAI
        const attributedUsers = inferAttributedUsers(input.credit || '');

        const [post] = await db
          .insert(Post)
          .values({
            displayId: displayId,
            content,
            provenance: input.credit || null,
            frontmatter,
            createdAt: new Date(),
            authorId: context.locals.user.id,
            urn: `urn:ctxs:gh:${userSegment}:${displayId}`,
            attributedGitHubUser: attributedUsers.attributedGithubUser,
            attributedXUser: attributedUsers.attributedXUser,
            sourceUrl: inferSourceUrl(input.credit || ''),
          })
          .returning();

        console.log('post', post);

        await sendPushoverNotification(
          `New post created by ${userSegment}`,
          `https://ctxs.ai/weekly/${post.slug}`
        );

        const workflowInstance = await triggerWorkflow(
          `urn:ctxs:gh:${userSegment}:${displayId}`
        );
        console.log('workflowInstance', workflowInstance);

        console.log('createPost', input);
        console.log('createdPost', post);

        return {
          post: { ...post, slug: post.displayId },
          workflow: workflowInstance,
        };
      } else {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'User must be logged in.',
        });
      }
    },
  }),

  upvotePost: defineAction({
    input: z.object({
      postId: z.number(),
    }),
    handler: async (input, context) => {
      if (!context.locals.user?.id) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'User must be logged in to upvote.',
        });
      }

      try {
        const [vote] = await db
          .insert(Vote)
          .values({
            postId: input.postId,
            userId: context.locals.user.id,
            createdAt: new Date(),
          })
          .returning();

        const post = await db
          .select({ title: Post.title, slug: Post.slug })
          .from(Post)
          .where(eq(Post.id, input.postId));

        if (post.length > 0) {
          await sendPushoverNotification(
            `New upvote on post: ${post[0].title} by ${context.locals.user.email}`,
            `https://ctxs.ai/weekly/${post[0].slug}`
          );
        }

        return { success: true, vote };
      } catch (error: any) {
        // If the vote already exists, that's fine - we'll return success
        // PostgreSQL error code for unique constraint violation is 23505
        if (
          error.code === '23505' ||
          error.code === 'SQLITE_CONSTRAINT_UNIQUE'
        ) {
          return { success: true };
        }
        throw error;
      }
    },
  }),
};

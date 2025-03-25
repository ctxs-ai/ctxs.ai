import { defineAction, ActionError } from 'astro:actions';
import { getFrontmatter, splitFrontmatter } from '@/lib/utils';
import { z } from 'astro:schema';
import { OPENAI_API_KEY, PUSHOVER_APP_TOKEN, PUSHOVER_USER_KEY } from 'astro:env/server';
import { db } from '@/lib/db';
import { customAlphabet } from 'nanoid';
import slugify from '@sindresorhus/slugify';
import { availableTags } from '@/lib/constants';
import { Post, User, Vote } from '@/db/schema';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { eq } from 'drizzle-orm';
import { inferGitHubUsername, inferXUsername } from '@/lib/utils';
import yaml from 'js-yaml';
const generateDisplayId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

type PostMetadata = {
  title: string;
  description: string;
  tags: string[];
};

const openai = createOpenAI({ apiKey: OPENAI_API_KEY })

type InferredAttributedUsers = {
  attributedGithubUser: string | null;
  attributedXUser: string | null;
};

const inferAttributedUsers = (content: string): InferredAttributedUsers => {
  return {
    attributedGithubUser: inferGitHubUsername(content),
    attributedXUser: inferXUsername(content),
  }
};

const inferSourceUrl = (credit: string): string | null => {
  const url = credit.match(/https?:\/\/[^\s]+/);
  return url ? url[0] : null;
}

const generatePostMetadata = async (content: string): Promise<PostMetadata> => {
  const result = await generateObject<PostMetadata>({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      title: z.string().describe('A concise, descriptive title for the context window'),
      description: z.string().describe('A brief summary of what this context window might help with, 120 characters maximum.'),
      tags: z.array(z.string()).describe(`Relevant tags for categorizing the post. `),
    }),
    prompt: `You are managing a library of context windows and prompts.
     Please generate a title, description, and tags for the following post content:\n\n${content}.
     The list of valid tags: ${JSON.stringify(availableTags)}
     Only add tags if you are confident that they apply to the post.`,
  });

  return result.object;
};

const sendPushoverNotification = async (message: string, url: string) => {
  if (!PUSHOVER_APP_TOKEN || !PUSHOVER_USER_KEY) {
    console.log('Pushover credentials not configured, skipping notification');
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('token', PUSHOVER_APP_TOKEN);
    formData.append('user', PUSHOVER_USER_KEY);
    formData.append('message', message);
    formData.append('url', url);

    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      console.error('Failed to send Pushover notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Pushover notification:', error);
  }
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
        const frontmatter = yaml.load(frontmatterString, { schema: yaml.FAILSAFE_SCHEMA })
        const user = await db.select({ githubUserName: User.githubUserName }).from(User).where(eq(User.id, context.locals.user.id))
        const userSegment = user[0].githubUserName || context.locals.user.id

        // Generate title, description and tags using OpenAI
        const metadata = await generatePostMetadata(content);
        const attributedUsers = inferAttributedUsers(input.credit || '');
        const displayId = generateDisplayId()

        const [post] = await db.insert(Post).values({
          title: metadata.title,
          description: metadata.description,
          displayId: displayId,
          slug: slugify(metadata.title) + '-' + displayId,
          content,
          provenance: input.credit || null,
          frontmatter,
          tags: metadata.tags,
          createdAt: new Date(),
          authorId: context.locals.user.id,
          urn: `urn:ctxs:gh:${userSegment}:${displayId}`,
          attributedGitHubUser: attributedUsers.attributedGithubUser,
          attributedXUser: attributedUsers.attributedXUser,
          sourceUrl: inferSourceUrl(input.credit || ''),
        }).returning();

        await sendPushoverNotification(
          `New post created: ${metadata.title} by ${userSegment}`,
          `https://ctxs.ai/weekly/${post.slug}`
        );

        console.log('createPost', input)
        console.log('createdPost', post)

        return post;
      } else {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });
      }
    }
  }),

  upvotePost: defineAction({
    input: z.object({
      postId: z.number(),
    }),
    handler: async (input, context) => {
      if (!context.locals.user?.id) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in to upvote.",
        });
      }

      try {
        const [vote] = await db.insert(Vote).values({
          postId: input.postId,
          userId: context.locals.user.id,
          createdAt: new Date(),
        }).returning();

        const post = await db
          .select({ title: Post.title, slug: Post.slug })
          .from(Post)
          .where(eq(Post.id, input.postId));

        if (post.length > 0) {
          await sendPushoverNotification(
            `New upvote on post: ${post[0].title}`,
            `https://ctxs.ai/weekly/${post[0].slug}`
          );
        }

        return { success: true, vote };
      } catch (error: any) {
        // If the vote already exists, that's fine - we'll return success
        // PostgreSQL error code for unique constraint violation is 23505
        if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return { success: true };
        }
        throw error;
      }
    }
  })
} 
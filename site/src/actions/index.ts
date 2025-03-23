import { defineAction, ActionError } from 'astro:actions';
import yaml from 'js-yaml';
import { z } from 'astro:schema';
import { OPENAI_API_KEY } from 'astro:env/server';
import { db } from '@/lib/db';
import { customAlphabet } from 'nanoid';
import slugify from '@sindresorhus/slugify';
import { availableTags } from '@/lib/constants';
import { Post, User, Vote } from '@/db/schema';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { eq } from 'drizzle-orm';

const generateDisplayId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

const getFrontmatter = (content: string) => {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatter) {
    return frontmatter[1];
  }
  return "";
}

const splitFrontmatter = (md: string) => {
  const frontmatterString = getFrontmatter(md);
  const content = md.replace(/^---\n([\s\S]*?)\n---/, '');
  const frontmatter = yaml.load(frontmatterString, { schema: yaml.FAILSAFE_SCHEMA })
  return { frontmatter, content };
};

type PostMetadata = {
  title: string;
  description: string;
  tags: string[];
};

const openai = createOpenAI({ apiKey: OPENAI_API_KEY })

const generatePostMetadata = async (content: string): Promise<PostMetadata> => {
  const result = await generateObject<PostMetadata>({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      title: z.string().describe('A concise, descriptive title for the context window'),
      description: z.string().describe('A brief summary of what this context window might help with, 120 characters maximum.'),
      tags: z.array(z.string()).describe(`Choose relevant tags for categorizing the post. The list of valid tags: ${JSON.stringify(availableTags)}`),
    }),
    prompt: `You are managing a library of context windows and prompts.
     Please generate a title, description, and tags for the following post content:\n\n${content}`,
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
        const { frontmatter, content } = splitFrontmatter(input.content);
        const user = await db.select({ githubUserName: User.githubUserName }).from(User).where(eq(User.id, context.locals.user.id))
        const userSegment = user[0].githubUserName || context.locals.user.id

        // Generate title, description and tags using OpenAI
        const metadata = await generatePostMetadata(content);
        const displayId = generateDisplayId()

        const [post] = await db.insert(Post).values({
          title: metadata.title,
          description: metadata.description,
          displayId: displayId,
          slug: slugify(metadata.title) + '-' + displayId,
          content,
          // TODO what to do with credit?
          frontmatter,
          tags: metadata.tags,
          createdAt: new Date(),
          authorId: context.locals.user.id,
          urn: `urn:ctxs:gh:${userSegment}:${displayId}`,
        }).returning();

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
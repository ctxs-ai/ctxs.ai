import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { db } from '@/lib/db';
import { Post, Vote } from '@/db/schema';

export const server = {
  createPost: defineAction({
    input: z.object({
      title: z.string(),
      content: z.string(),
    }),
    handler: async (input, context) => {
      if (context.locals.user?.id) {
        const [post] = await db.insert(Post).values({
          title: input.title,
          content: input.content,
          createdAt: new Date().toISOString(),
          authorId: context.locals.user.id,
        }).returning();

        console.log('createPost', input)
        console.log('createdPost', post)
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
      postId: z.string(),
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
          createdAt: new Date().toISOString(),
        }).returning();

        return { success: true, vote };
      } catch (error: any) {
        // If the vote already exists, that's fine - we'll return success
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return { success: true };
        }
        throw error;
      }
    }
  })
} 
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  createPost: defineAction({
    input: z.object({
      title: z.string(),
      content: z.string(),
    }),
    handler: async (input, context) => {
      // TODO implement this
      console.log('createPost', input)
    }
  })
} 
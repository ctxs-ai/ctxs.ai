import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const contexts = defineCollection({
    // type: 'content',
    loader: glob({ pattern: ["**/*.(md|mdx)", "!**/README.md"], base: "../contexts" }),
    schema: z.object({
        // We can add more frontmatter schema validation here if needed
        title: z.string().optional(),
        provenance: z.string().optional(),
        description: z.string().optional(),
        target: z.string().optional(),
    }),
})

export const collections = {
    contexts
}; 
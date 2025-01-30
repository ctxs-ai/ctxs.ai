/// <reference types="astro/client" />
declare module 'astro:content' {
    interface Render {
        '.md': Promise<{
            Content: import('astro').MarkdownInstance<{}>['Content'];
            headings: import('astro').MarkdownHeading[];
            remarkPluginFrontmatter: Record<string, any>;
        }>;
    }
}

// Tell TypeScript about the content collections
declare module 'astro:content' {
    export interface CollectionEntry<C> {
        data: C extends 'contexts' ? {
            title?: string;
        } : never;
    }
} 
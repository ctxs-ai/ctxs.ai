import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { Post } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
    const { urn } = params;

    if (!urn) {
        return new Response('URN is required', { status: 400 });
    }

    try {
        const posts = await db.select().from(Post).where(eq(Post.urn, urn as string));
        const post = posts[0];

        if (!post || !post.content) {
            return new Response('Post not found', { status: 404 });
        }

        return new Response(post.content, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        console.error('Error reading post:', error);
        return new Response('Error reading post', { status: 500 });
    }
};
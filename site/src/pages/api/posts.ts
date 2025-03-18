import type { APIRoute } from 'astro';
import { db, post as Post } from 'astro:db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return new Response(JSON.stringify({
        error: "Title and content are required"
      }), { status: 400 });
    }

    // Insert the new post
    const [post] = await db.insert(Post).values({
      title: body.title,
      content: body.content,
      createdAt: new Date()
    }).returning();

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({
      error: "Failed to create post"
    }), { status: 500 });
  }
} 
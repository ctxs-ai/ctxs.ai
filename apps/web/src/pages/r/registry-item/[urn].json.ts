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

    // Extract author from URN (assuming URN format contains author)
    const author = post.attributedGitHubUser || post.authorId;

    // Construct response object matching registry-item schema
    const response = {
      "$schema": "https://ctxs.ai/schema/registry-item.json",
      name: post.displayId,
      type: 'registry:file',
      author: author,
      description: post.description || '',
      title: post.title || '',
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
      files: [{
        "path": `/r/registry-item/${post.urn}.json`,
        "content": post.content,
        "type": "registry:file",
        "target": post.targetFile || `ctxs/${post.slug}.md`
      }]
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing post:', error);
    return new Response('Error reading post', { status: 500 });
  }
};

export async function getStaticPaths() {
  const posts = await db.select().from(Post);

  return posts.map((post: typeof Post.$inferSelect) => ({
    params: { urn: post.urn }
  }));
} 
import {
  WorkflowEntrypoint,
  WorkflowStep,
  WorkflowEvent,
  Workflow,
} from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
import { availableTags, sendPushoverNotification } from '@ctxs/util';
import postgres from 'postgres';
import * as schema from '@ctxs/db';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { eq } from 'drizzle-orm';
import slugify from '@sindresorhus/slugify';

type Env = {
  // Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
  MY_WORKFLOW: Workflow;
  DATABASE_URL: string;
  CF_API_SECRET: string;
  PUSHOVER_APP_TOKEN: string;
  PUSHOVER_USER_KEY: string;
  OPENAI_API_KEY: string;
};

// User-defined params passed to your workflow
type Params = {
  email: string;
  metadata: Record<string, string>;
};

type PostMetadata = {
  title: string;
  description: string;
  tags: string[];
  slug: string;
};

const generatePostMetadata = async (
  apiKey: string,
  content: string
): Promise<PostMetadata> => {
  const openai = createOpenAI({ apiKey });
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

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const postUrn = event.payload.postUrn;
    // console.log("workflow payload", event)
    // Can access bindings on `this.env`
    // Can access params on `event.payload`

    const connectionString = this.env.DATABASE_URL!;
    // console.log("connectionString", connectionString)
    const client = postgres(connectionString, { max: 5, fetch_types: true });
    const db = drizzle(client, { schema });

    const post = await step.do('get post', async () => {
      const posts = await db
        .select()
        .from(schema.Post)
        .where(eq(schema.Post.urn, postUrn));
      console.log({ posts });
      return posts[0];
    });

    const metadata = await step.do('infer post metadata', async () => {
      const metadata = await generatePostMetadata(
        this.env.OPENAI_API_KEY!,
        post.content
      );
      console.log({ metadata });
      return metadata;
    });

    const updatedPost = await step.do('update post metadata', async () => {
      const newSlug =
        post.slug || slugify(metadata.slug) + '-' + post.displayId;
      const [updatedPost] = await db
        .update(schema.Post)
        .set({
          title: metadata.title,
          description: metadata.description,
          slug: newSlug,
          tags: metadata.tags,
        })
        .where(eq(schema.Post.urn, postUrn))
        .returning();
      console.log({ updatedPost });
      return updatedPost;
    });

    // Send Pushover notification about the completed metadata update
    await step.do('send notification', async () => {
      const baseUrl = 'https://ctxs.ai/p/';
      const postUrl = `${baseUrl}${updatedPost.slug}`;
      const message = `Post metadata updated: "${updatedPost.title}"`;

      await sendPushoverNotification(message, postUrl);

      return { notificationSent: true };
    });

    // const apiResponse = await step.do('some other step', async () => {
    //   let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
    //   return await resp.json<any>();
    // });

    // await step.sleep('wait on something', '1 minute');

    // await step.do(
    //   'make a call to write that could maybe, just might, fail',
    //   // Define a retry strategy
    //   {
    //     retries: {
    //       limit: 2,
    //       delay: '5 second',
    //       backoff: 'exponential',
    //     },
    //     timeout: '15 minutes',
    //   },
    //   async () => {
    //     // Do stuff here, with access to the state from our previous steps
    //     if (Math.random() > 0.5) {
    //       throw new Error('Test error was thrown');
    //     }
    //   },
    // );
  }
}

export default {
  // This is in the same file as your Workflow definition
  async fetch(req: Request, env: Env): Promise<Response> {
    let url = new URL(req.url);

    // Check API Secret authentication
    const apiSecret = req.headers.get('X-API-Secret');
    console.log({ apiSecret });
    console.log({ env: env.CF_API_SECRET });
    if (!apiSecret || apiSecret !== env.CF_API_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (url.pathname.startsWith('/favicon')) {
      return Response.json({}, { status: 404 });
    }

    // Handle GET request with instanceId
    if (req.method === 'GET') {
      let id = url.searchParams.get('instanceId');
      if (id) {
        let instance = await env.MY_WORKFLOW.get(id);
        return Response.json({
          status: await instance.status(),
        });
      }
    }

    // Handle POST request with JSON body
    // TODO: implement super simple jwt based bearer auth
    // port this to hono
    if (req.method === 'POST') {
      try {
        const payload = await req.json();
        console.log('http payload', payload);
        let instance = await env.MY_WORKFLOW.create({ params: payload });
        return Response.json({
          id: instance.id,
          details: await instance.status(),
        });
      } catch (error) {
        return Response.json(
          { error: 'Invalid JSON payload' },
          { status: 400 }
        );
      }
    }

    // Default case - return 405 Method Not Allowed
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  },
};

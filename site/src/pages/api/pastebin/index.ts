import type { APIRoute } from 'astro';
import type { APIContext } from 'astro';
import { customAlphabet } from 'nanoid';

export const prerender = false;

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 10);

export const POST: APIRoute = async ({ request, locals, redirect }: APIContext) => {
  const formData = await request.formData();
  const content = formData.get('content');

  if (!content) {
    return new Response('Content is required', { status: 400 });
  }

  const { CTXS_KV } = locals.runtime.env;
  const pasteId = nanoid(8);
  const data = {
    createdAt: Date.now(),
    content: content.toString(),
    id: pasteId,
    title: `Paste ${pasteId}`,
    description: content.toString().slice(0, 100) + (content.toString().length > 100 ? '...' : '')
  }

  await CTXS_KV.put(`paste:${pasteId}`, JSON.stringify(data));

  return redirect(`/pastebin/${pasteId}`);
}
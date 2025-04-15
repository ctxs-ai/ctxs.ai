import type { APIRoute } from 'astro';
import type { APIContext } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }: APIContext) => {
    const { CTXS_KV } = locals.runtime.env

    const count = await CTXS_KV.get('count')
    await CTXS_KV.put('count', (parseInt(count || '0') + 1).toString())

    return new Response(JSON.stringify({
        message: 'Hello, world!',
        count: parseInt(count || '0')
    }));
}
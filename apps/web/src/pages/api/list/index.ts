import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const contexts = await getCollection('contexts');
    const url = new URL(request.url)
    const query = Object.fromEntries(url.searchParams)

    console.log(request.url, query);
    const data = contexts.map((context) => {
        return {
            uri: `https://ctxs.ai/gh/${context.id}`,
            title: context.data.title,
            description: context.data.description,
        };
    });
    console.log(data);
    return new Response(JSON.stringify(data));
}
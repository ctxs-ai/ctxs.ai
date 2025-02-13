import type { APIRoute } from 'astro';
import yaml from 'js-yaml';
import { getCollection, type CollectionEntry } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
    const { username, context_id } = params;

    try {
        const contexts = await getCollection('contexts');
        const entry = contexts.find(entry => {
            // This probably can lookup via entry.id directly
            const [entryUsername, entryContextId] = entry.id.split('/');
            return entryUsername === username && entryContextId === context_id;
        });

        if (!entry) {
            return new Response('Context not found', { status: 404 });
        }

        const fm = entry.rendered.metadata.frontmatter
        const fullFile = "---\n" + yaml.dump(fm) + "---\n" + entry.body

        return new Response(fullFile, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    } catch (error) {
        console.log(error)
        return new Response('Error reading context', { status: 500 });
    }
};
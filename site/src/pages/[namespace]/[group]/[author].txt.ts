import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
    const { namespace, group, author } = params;

    try {
        const contexts = await getCollection('contexts');
        const entry = contexts.find(entry => {
            return group + "/" + author === entry.id;
        });

        if (!entry) {
            return new Response('Context not found', { status: 404 });
        }

        return new Response(entry.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        console.log(error)
        return new Response('Error reading context', { status: 500 });
    }
};

export async function getStaticPaths() {
    const contexts = await getCollection('contexts');

    return contexts.map(entry => {
        return {
            params: {
                namespace: "gh",
                group: entry.id.split("/")[0],
                author: entry.id.split("/")[1],
            }
        };
    });
}
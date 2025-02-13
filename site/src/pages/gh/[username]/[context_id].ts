import type { APIRoute } from 'astro';
import yaml from 'js-yaml';
import { getCollection, type CollectionEntry } from 'astro:content';

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
                'Content-Type': 'text/markdown',
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
        const [username, context_id] = entry.id.split('/');
        return {
            params: { username, context_id }
        };
    });
}
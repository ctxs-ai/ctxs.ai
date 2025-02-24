import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
    const { ghid } = params;

    try {
        const contexts = await getCollection('contexts');
        const entry = contexts.find(entry => {
            return ghid === entry.id;
        });

        const [author, filename] = entry?.id.split('/') ?? [];

        if (!entry || !entry.body) {
            return new Response('Context not found', { status: 404 });
        }

        // Construct response object matching registry-item schema
        const response = {
            "$schema": "https://ctxs.ai/schema/registry-item.json",
            name: filename,
            type: 'registry:file',
            author: author,
            description: entry.data.description,
            title: entry.data.title,
            dependencies: [],
            devDependencies: [],
            registryDependencies: [],
            files: [{
                "path": `/gh/${entry.id}`,
                "content": entry.body,
                "type": "registry:file",
                "target": entry.data.target || `../ctxs/${filename}.md`
            }]
            // meta: bodyContent.meta,
            // docs: bodyContent.docs,
            // categories: bodyContent.categories
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error processing context:', error);
        return new Response('Error reading context', { status: 500 });
    }
};

export async function getStaticPaths() {
    const contexts = await getCollection('contexts');

    return contexts.map(entry => {
        return {
            params: { ghid: entry.id }
        };
    });
}
import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

function contextToRegistryItem(entry: CollectionEntry<'contexts'>) {
  const [author, filename] = entry.id.split('/');
  return {
    "$schema": "https://ctxs.ai/schema/registry-item.json",
    name: filename,
    author: author,
    type: 'registry:file',
    description: entry.data.description,
    title: entry.data.title,
    registryDependencies: [],
    files: [{
      "path": `/gh/${entry.id}`,
      "type": "registry:file",
      "target": entry.data.target || `ctxs/${filename}.md`
    }]
  };
}

export const GET: APIRoute = async () => {
  try {
    const contexts = await getCollection('contexts');
    const registryItems = contexts.map(contextToRegistryItem);

    return new Response(JSON.stringify(registryItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing contexts:', error);
    return new Response('Error reading contexts', { status: 500 });
  }
};
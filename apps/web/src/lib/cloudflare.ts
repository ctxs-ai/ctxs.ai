import Cloudflare from 'cloudflare';
import { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } from 'astro:env/server';

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN!,
});

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;

export const triggerWorkflow = async (postUrn: string) => {
  const instance = await client.workflows.instances.create(
    'workflows-starter',
    { account_id: accountId, params: { postUrn } }
  );
  return instance;
};

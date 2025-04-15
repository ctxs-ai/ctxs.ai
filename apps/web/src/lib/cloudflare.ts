import { CF_ENDPOINT, CF_API_SECRET } from 'astro:env/server';

export const triggerWorkflow = async (postUrn: string) => {
  console.log('apiurl', `${CF_ENDPOINT}/`);
  const apiReq = await fetch(`${CF_ENDPOINT}/`, {
    method: 'POST',
    headers: {
      'X-API-Secret': CF_API_SECRET,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postUrn: postUrn }),
  });
  const body = await apiReq.json();
  console.log('apiRes', body);
  return body;
};

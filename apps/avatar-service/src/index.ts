// src/index.ts
import puppeteer from "@cloudflare/puppeteer";

interface Env {
  AVATAR_CACHE: KVNamespace;
  BROWSER: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(Boolean);

      // Validate path format
      if (pathParts.length !== 3) {
        return new Response(
          JSON.stringify({ error: 'Invalid path format. Use /:platform/:user/:size' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const [platform, username, size] = pathParts;
      const validPlatforms = ['github', 'x'];
      const sizeNum = parseInt(size);

      // Validate inputs
      if (!validPlatforms.includes(platform)) {
        return new Response(
          JSON.stringify({ error: 'Invalid platform. Use "github" or "x"' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (isNaN(sizeNum) || sizeNum <= 0) {
        return new Response(
          JSON.stringify({ error: 'Size must be a positive number' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Generate cache key
      const cacheKey = `${platform}:${username}:${size}`;

      // Check cache first
      const cachedImage = await env.AVATAR_CACHE.get(cacheKey, { type: 'arrayBuffer' });
      if (cachedImage) {
        return new Response(cachedImage, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          }
        });
      }

      // Fetch avatar based on platform
      let imageResponse: Response;
      if (platform === 'github') {
        imageResponse = await fetch(
          `https://github.com/${username}.png?size=${size}`
        );
      } else { // x
        const browser = await puppeteer.launch(env.BROWSER);
        const page = await browser.newPage();

        try {
          await page.goto(`https://x.com/${username}`, {
            timeout: 15000
          });

          // Wait for profile image to load
          await page.waitForSelector('a[href$="/photo"] img[src]', { timeout: 10000 });

          // Get the image URL
          const imageUrl = await page.evaluate(() => {
            const img = document.querySelector('a[href$="/photo"] img[src]');
            return img ? img.getAttribute('src') : null;
          });

          if (!imageUrl) {
            throw new Error('Profile image not found');
          }

          console.log({ imageUrl })
          // Fetch the actual image
          imageResponse = await fetch(imageUrl);
        } finally {
          await browser.close();
        }
      }

      if (!imageResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch avatar' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const imageBuffer = await imageResponse.arrayBuffer();

      // Cache the image (30 days expiration)
      await env.AVATAR_CACHE.put(cacheKey, imageBuffer, { expirationTtl: 2592000 });

      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
} satisfies ExportedHandler<Env>;
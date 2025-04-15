# Avatar Fetcher Worker

A Cloudflare Worker that retrieves and caches user avatar images from GitHub and X.

## Features
- Fetches avatars from GitHub and X
- Caches images in Cloudflare KV for 30 days
- Serves cached images with 24-hour browser cache
- Endpoint: `/:platform/:user/:size`
- Supported platforms: `github`, `x`

## Prerequisites
- Cloudflare account with Workers enabled
- KV namespace created
- Node.js and bun installed

## Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   bun add @cloudflare/puppeteer --save-dev
   ```
3. Update `wrangler.jsonc`:
   - Replace KV namespace IDs
   - Ensure browser binding is configured

## Deployment
```bash
bunx wrangler deploy
```

## Usage
```bash
# Get GitHub avatar
curl "https://your-worker.workers.dev/github/username/200"

# Get X avatar
curl "https://your-worker.workers.dev/x/username/200"
```

## Configuration
- `AVATAR_CACHE`: KV namespace binding for caching
- `BROWSER`: Browser Rendering binding for X avatar fetching

## Development
- Test locally: `bunx wrangler dev`
- Deploy: `bunx wrangler deploy`

## Notes
- Size parameter works natively with GitHub but not X (returns original size)
- X avatar fetching uses Browser Rendering API
- Error handling returns JSON responses with appropriate status codes

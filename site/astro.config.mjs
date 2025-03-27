// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://ctxs.ai',
  output: 'server',
  redirects: {
    '/gh/martinklepsch/cursor-rules-prompt/': '/weekly/cursor-rules-prompt-j9tvia',
    '/': '/weekly',
  },
  env: {
    schema: {
      TURSO_CONNECTION_URL: envField.string({ context: "server", access: "secret" }),
      TURSO_AUTH_TOKEN: envField.string({ context: "server", access: "secret" }),
      OPENAI_API_KEY: envField.string({ context: "server", access: "secret" }),
      GITHUB_CLIENT_ID: envField.string({ context: "server", access: "secret" }),
      GITHUB_CLIENT_SECRET: envField.string({ context: "server", access: "secret" }),
      BETTER_AUTH_URL: envField.string({ context: "server", access: "secret", optional: true }),
      BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret" }),
      PUSHOVER_APP_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      PUSHOVER_USER_KEY: envField.string({ context: "server", access: "secret", optional: true }),
    }
  },
  // adapter: cloudflare(),
  adapter: node({ mode: 'standalone' }),
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: true
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      // https://github.com/facebook/react/issues/31827#issuecomment-2563094822
      alias: import.meta.env.PROD ? {
        "react-dom/server": "react-dom/server.edge",
      } : {},
    },
  },

  integrations: [react()]
});
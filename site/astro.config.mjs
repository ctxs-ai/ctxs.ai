// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://ctxs.ai',
  output: 'static',
  adapter: cloudflare(),
  prefetch: true,
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
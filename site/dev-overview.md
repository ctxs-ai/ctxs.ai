# CTXs.ai Project Documentation

This document provides a comprehensive overview of the CTXs.ai project architecture, setup, and configuration details for its key components.

## Table of Contents

1. [Astro Site Configuration](#astro-site-configuration)
2. [TailwindCSS & Styling](#tailwindcss--styling)
3. [Astro Actions](#astro-actions)
4. [Database Setup with Drizzle ORM](#database-setup-with-drizzle-orm)
5. [Authentication with Better Auth](#authentication-with-better-auth)

## Astro Site Configuration

The CTXs.ai project is built using [Astro](https://astro.build/), a modern framework for building content-focused websites. 

### Key Configuration

The `astro.config.mjs` file is the central configuration file:

```javascript
// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ctxs.ai',
  output: 'server',
  redirects: {
    '/gh/martinklepsch/cursor-rules-prompt/': '/weekly/cursor-rules-prompt-j9tvia',
    '/': '/weekly',
  },
  env: {
    schema: {
      OPENAI_API_KEY: envField.string({ context: "server", access: "secret" }),
      GITHUB_CLIENT_ID: envField.string({ context: "server", access: "secret" }),
      GITHUB_CLIENT_SECRET: envField.string({ context: "server", access: "secret" }),
      BETTER_AUTH_URL: envField.string({ context: "server", access: "secret", optional: true }),
      BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret" }),
      PUSHOVER_APP_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      PUSHOVER_USER_KEY: envField.string({ context: "server", access: "secret", optional: true }),
    }
  },
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
      alias: import.meta.env.PROD ? {
        "react-dom/server": "react-dom/server.edge",
      } : {},
    },
  },
  integrations: [react()]
});
```

### Project Structure

The Astro project follows a standard structure:

- `/src/pages/`: Contains all route pages
- `/src/components/`: Reusable UI components
- `/src/layouts/`: Page layouts including the main `Layout.astro`
- `/src/lib/`: Utility functions and core functionality
- `/src/actions/`: Server-side actions using Astro's API endpoints
- `/src/db/`: Database schema and related code
- `/public/`: Static assets

### Package Configuration

The project uses `bun` as package manager. Key dependencies include:

```json
{
  "dependencies": {
    "@astrojs/node": "^9.1.3",
    "@astrojs/react": "^4.2.0",
    "astro": "^5.2.0",
    "better-auth": "^1.2.4",
    "drizzle-orm": "^0.40.1",
    "postgres": "^3.4.5",
    "react": "^19.0.0", 
    "tailwindcss": "^4.0.3"
  }
}
```

### Base Layout

The `Layout.astro` file serves as the main wrapper for all pages:

```astro
---
import "../styles/global.css";
import "@fontsource/geist-mono";
import { ClientRouter } from "astro:transitions";
import Metadata from "@/components/Metadata.astro";
import Footer from "@/components/footer.astro";

const meta = Astro.props.meta;
---

<!doctype html>
<html transition:animate="none" lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://avatars.ctxs.ai" />
    <Metadata
      title={meta.title}
      description={meta.description}
      ogImage={meta.ogImage}
    />
    <ClientRouter />
  </head>
  <body>
    <slot />
    <Footer />
    <script>
      // Save scroll position with throttling
      const saveScrollPosition = () => {
        const key = `scrollPos_${window.location.pathname}`;
        sessionStorage.setItem(key, window.scrollY.toString());
      };

      window.addEventListener("scroll", saveScrollPosition);

      // On page load
      document.addEventListener("astro:after-swap", () => {
        const currentPath = window.location.pathname;
        const scrollPosKey = `scrollPos_${currentPath}`;

        // Restore scroll position if exists
        const savedPosition = sessionStorage.getItem(scrollPosKey);
        if (savedPosition !== null) {
          window.scrollTo(0, parseInt(savedPosition, 10));
        }
        // Clean up old scroll positions
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith("scrollPos_") && key !== scrollPosKey) {
            sessionStorage.removeItem(key);
          }
        });
      });
    </script>
  </body>
</html>
```

## TailwindCSS & Styling

The project uses Tailwind CSS v4 along with the shadcn UI component library.

### Tailwind Configuration

The styling configuration is managed through the `components.json` file:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/global.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Global CSS

The global CSS file utilizes Tailwind's directives and defines a comprehensive color theme system:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "tailwindcss-view-transitions";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  --dash-list-marker: '-';
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* More color variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* Dark mode color variables */
}

@theme inline {
  --font-mono: 'Geist Mono', monospace;
  --color-background: var(--background);
  /* More theme variables */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

The project also implements custom utilities for markdown rendering and prose styling.

## Astro Actions

The application uses Astro's server actions for client-server RPC calls. Actions are defined in `src/actions/index.ts`:

```typescript
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { OPENAI_API_KEY, PUSHOVER_APP_TOKEN, PUSHOVER_USER_KEY } from 'astro:env/server';
import { db } from '@/lib/db';
import { Post, User, Vote } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Action definitions
export const server = {
  createPost: defineAction({
    input: z.object({
      content: z.string(),
      credit: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (context.locals.user?.id) {
        // Post creation logic
        // Uses OpenAI for generating metadata
        // ...
        return post;
      } else {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });
      }
    }
  }),

  upvotePost: defineAction({
    input: z.object({
      postId: z.number(),
    }),
    handler: async (input, context) => {
      // Upvote logic
      // ...
    }
  })
}
```

These actions provide type-safe server endpoints that can be called from client components.

## Database Setup with Drizzle ORM

The project uses Drizzle ORM for database interactions with PostgreSQL.

### Drizzle Configuration

The `drizzle.config.ts` file configures the ORM:

```typescript
require("dotenv").config();

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations-pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ctxs_dev",
  },
});
```

### Database Schema

The schema is defined in `src/db/schema.ts` using Drizzle's schema definition:

```typescript
import { pgTable, serial, text, varchar, integer, boolean, timestamp, primaryKey, unique, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// Better-auth schema
export const User = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  githubUserName: text("github_user_name"),
});

export const Account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => User.id),
  // Other account fields
});

export const Session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => User.id),
  // Other session fields
});

export const Verification = pgTable("verification", {
  id: text("id").primaryKey(),
  // Verification fields
});

// Application schema
export const Post = pgTable("post", {
  id: serial("id").primaryKey(),
  displayId: text("display_id").notNull().unique(),
  slug: text("slug"),
  // Other post fields
});

export const Vote = pgTable("vote", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => User.id),
  postId: integer("post_id").notNull().references(() => Post.id),
}, (t) => [
  unique().on(t.userId, t.postId),
]);
```

### Database Connection

Database connection is managed in `src/lib/db.ts`:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

export let db;

if (process.env.NODE_ENV === "development") {
  // Local development connection
  const connectionString = process.env.DATABASE_URL!;
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
} else {
  // Production connection
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in production environment");
  }
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
}
```

## Authentication with Better Auth

The project uses `better-auth` for authentication, integrated with Drizzle ORM.

### Auth Configuration

Authentication is configured in `src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Account, Session, User, Verification } from "@/db/schema";
import { createAuthMiddleware } from "better-auth/api";
import { BETTER_AUTH_URL, BETTER_AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "astro:env/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  socialProviders: {
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/callback")) {
        // Get the github username from the user's account
        const userId = ctx.context.newSession?.user.id;
        const [account] = await db.select().from(Account).where(eq(Account.userId, userId!));
        const ghToken = account.accessToken;
        const { login } = await fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `Bearer ${ghToken}`,
          },
        }).then((res) => res.json());
        await db.update(User).set({ githubUserName: login }).where(eq(User.id, userId!));
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: User,
      account: Account,
      session: Session,
      verification: Verification
    },
  })
});
```

This configuration uses GitHub as a social provider for authentication and stores user data in the PostgreSQL database through the Drizzle adapter.

## Conclusion

The CTXs.ai project is built with modern web technologies, featuring:

1. An Astro-based server-rendered website
2. TailwindCSS v4 with shadcn UI components for styling
3. Astro Actions for type-safe client-server communication
4. Drizzle ORM for PostgreSQL database interaction
5. Better-Auth for social authentication via GitHub

This architecture provides a solid foundation for building a scalable web application with strong typing, modern styling, and secure authentication.
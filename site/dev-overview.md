# Modern Web Application Architecture Guide

This document provides a comprehensive overview of how to build a modern web application using Astro, TailwindCSS, Drizzle ORM, and Better Auth. It's designed as a reference guide for developers who want to create a similar stack.

## Table of Contents

1. [Astro Framework Setup](#astro-framework-setup)
2. [TailwindCSS & Styling](#tailwindcss--styling)
3. [Server Actions in Astro](#server-actions-in-astro)
4. [Database with Drizzle ORM](#database-with-drizzle-orm)
5. [Authentication with Better Auth](#authentication-with-better-auth)

## Astro Framework Setup

[Astro](https://astro.build/) is a modern framework for building content-focused websites with a focus on performance.

### Basic Configuration

Create an `astro.config.mjs` file to configure your Astro project:

```javascript
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://yoursite.com',
  output: 'server',  // For SSR support
  env: {
    schema: {
      // Environment variables with typing and security contexts
      API_KEY: envField.string({ context: "server", access: "secret" }),
      AUTH_SECRET: envField.string({ context: "server", access: "secret" }),
      // Optional variables
      OPTIONAL_VAR: envField.string({ context: "server", access: "secret", optional: true }),
    }
  },
  // Server adapter - can also use cloudflare, netlify, vercel, etc.
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
  },
  integrations: [react()]
});
```

### Recommended Project Structure

Organize your Astro project with these directories:

- `/src/pages/`: Route pages (file-based routing)
- `/src/components/`: Reusable UI components
- `/src/layouts/`: Page layouts and wrappers
- `/src/lib/`: Utility functions and core functionality
- `/src/actions/`: Server-side actions
- `/src/db/`: Database schema and helpers
- `/public/`: Static assets (served as-is)

### Key Dependencies

Here are essential dependencies for this stack:

```json
{
  "dependencies": {
    "@astrojs/node": "^9.0.0+",
    "@astrojs/react": "^4.0.0+",
    "astro": "^5.0.0+",
    "better-auth": "^1.0.0+",
    "drizzle-orm": "^0.40.0+",
    "postgres": "^3.0.0+",
    "react": "^19.0.0+", 
    "tailwindcss": "^4.0.0+"
  }
}
```

### Base Layout

Create a base layout component that all pages can extend:

```astro
---
// src/layouts/Layout.astro
import "../styles/global.css";
import { ClientRouter } from "astro:transitions";

const { title, description, image } = Astro.props.meta || {};
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:image" content={image} />
    <ClientRouter />
  </head>
  <body>
    <slot />
    <footer>
      <!-- Site footer -->
    </footer>
    <script>
      // Utility script for saving scroll position during transitions
      const saveScrollPosition = () => {
        const key = `scrollPos_${window.location.pathname}`;
        sessionStorage.setItem(key, window.scrollY.toString());
      };

      window.addEventListener("scroll", saveScrollPosition);

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

This project uses Tailwind CSS v4 with the shadcn UI component library for consistent styling.

### Tailwind Configuration

Set up the shadcn UI configuration in `components.json`:

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
    "lib": "@/lib"
  },
  "iconLibrary": "lucide"
}
```

### CSS Setup

Create a `global.css` file with Tailwind imports and theme variables:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  /* Light theme variables */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.87 0 0);
  --radius: 0.425rem;
}

.dark {
  /* Dark theme variables */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
}

@theme inline {
  /* Theme variables for components */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Monospace', monospace;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
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

## Server Actions in Astro

Astro Actions provide type-safe server functions that can be called from the client.

### Creating Actions

Define your server actions in a dedicated file:

```typescript
// src/actions/index.ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { API_KEY } from 'astro:env/server';
import { db } from '@/lib/db';
import { Post, User } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const server = {
  createResource: defineAction({
    // Input validation using Zod
    input: z.object({
      title: z.string(),
      content: z.string(),
      metadata: z.record(z.string(), z.any()).optional(),
    }),
    
    // Handler function
    handler: async (input, context) => {
      // Check authentication
      if (!context.locals.user?.id) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });
      }
      
      // Database operation
      const [resource] = await db.insert(Post).values({
        title: input.title,
        content: input.content,
        metadata: input.metadata || {},
        authorId: context.locals.user.id,
        createdAt: new Date(),
      }).returning();
      
      return resource;
    }
  }),
  
  updateResource: defineAction({
    input: z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
    }),
    
    handler: async (input, context) => {
      // Similar pattern with authentication and database operations
      // ...
    }
  })
}
```

### Using Actions from the Client

Call these actions from your client components:

```astro
---
// src/pages/create.astro
import Layout from '@/layouts/Layout.astro';
import { server } from '@/actions';

// Handle form submission
let result;
let error;

if (Astro.request.method === 'POST') {
  try {
    const formData = await Astro.request.formData();
    const title = formData.get('title')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    
    result = await server.createResource({ title, content });
  } catch (e) {
    error = e.message;
  }
}
---

<Layout meta={{ title: "Create Resource" }}>
  <main>
    <h1>Create New Resource</h1>
    
    {error && <div class="error">{error}</div>}
    {result && <div class="success">Resource created successfully!</div>}
    
    <form method="POST">
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" name="title" required />
      </div>
      
      <div>
        <label for="content">Content</label>
        <textarea id="content" name="content" required></textarea>
      </div>
      
      <button type="submit">Create</button>
    </form>
  </main>
</Layout>
```

## Database with Drizzle ORM

Drizzle ORM provides a type-safe database interface for PostgreSQL (and other databases).

### Configuration

Create a Drizzle configuration file:

```typescript
// drizzle.config.ts
require("dotenv").config();
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/myapp",
  },
});
```

### Schema Definition

Define your database schema with Drizzle's type-safe definitions:

```typescript
// src/db/schema.ts
import { pgTable, serial, text, varchar, integer, boolean, timestamp, primaryKey, unique, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// Authentication tables
export const User = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => User.id),
  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  scope: text("scope"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => User.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Application tables
export const Resource = pgTable("resource", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  authorId: text("author_id").notNull().references(() => User.id),
});

export const Tag = pgTable("tag", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const ResourceToTag = pgTable("resource_to_tag", {
  resourceId: integer("resource_id").notNull().references(() => Resource.id),
  tagId: integer("tag_id").notNull().references(() => Tag.id),
}, (t) => ({
  pk: primaryKey(t.resourceId, t.tagId),
}));
```

### Database Connection

Set up your database connection:

```typescript
// src/lib/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

export let db;

if (process.env.NODE_ENV === "development") {
  // Local development connection
  const connectionString = process.env.DATABASE_URL!;
  console.log("Initializing development database connection");
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

### Migration Commands

Add migration scripts to your package.json:

```json
{
  "scripts": {
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate",
    "push": "drizzle-kit push",
    "studio": "drizzle-kit studio"
  }
}
```

## Authentication with Better Auth

Better Auth is a flexible authentication solution for modern web applications.

### Configuration

Set up Better Auth with GitHub authentication:

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Account, Session, User, Verification } from "@/db/schema";
import { createAuthMiddleware } from "better-auth/api";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

// Get env variables
const {
  BETTER_AUTH_URL,
  BETTER_AUTH_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = import.meta.env;

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  
  // Social login providers
  socialProviders: {
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
    // Add other providers as needed (Google, Twitter, etc.)
  },
  
  // Authentication hooks
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Example: Store additional user info after successful authentication
      if (ctx.path.startsWith("/callback")) {
        const userId = ctx.context.newSession?.user.id;
        if (userId) {
          // Fetch provider-specific data
          const [account] = await db.select().from(Account)
            .where(eq(Account.userId, userId));
            
          if (account && account.providerId === "github") {
            // Get additional GitHub data using access token
            const { login } = await fetch(`https://api.github.com/user`, {
              headers: {
                Authorization: `Bearer ${account.accessToken}`,
              },
            }).then((res) => res.json());
            
            // Update user record with GitHub username
            await db.update(User)
              .set({ githubUsername: login })
              .where(eq(User.id, userId));
          }
        }
      }
    }),
  },
  
  // Database adapter configuration
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

### Authentication Routes

Create authentication API routes in your Astro application:

```typescript
// src/pages/api/auth/[...all].ts
import { auth } from "@/lib/auth";

export const all = auth.buildHandler();

export function GET(...args) { return all(...args); }
export function POST(...args) { return all(...args); }
```

### Auth Middleware

Integrate with Astro's middleware for authentication:

```typescript
// src/middleware.ts
import { auth } from "@/lib/auth";
import { sequence } from "astro:middleware";
import { defineMiddleware } from "astro:middleware";

// Auth middleware to add user to context
const authMiddleware = defineMiddleware(async (context, next) => {
  // Skip for static assets and auth API routes
  if (
    context.url.pathname.startsWith("/assets") ||
    context.url.pathname.startsWith("/api/auth")
  ) {
    return next();
  }

  // Get user from session
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();
  
  // Add user to Astro locals for access in components
  context.locals.user = session?.user || null;
  context.locals.authRequest = authRequest;
  
  return next();
});

// Other middleware functions can be added to the sequence
export const onRequest = sequence(authMiddleware);
```

### Login and Protected Pages

Create login and protected pages:

```astro
---
// src/pages/signin.astro
import Layout from '@/layouts/Layout.astro';

// Redirect if already logged in
if (Astro.locals.user) {
  return Astro.redirect("/dashboard");
}
---

<Layout meta={{ title: "Sign In" }}>
  <main>
    <h1>Sign In</h1>
    <div class="auth-buttons">
      <a href="/api/auth/signin/github" class="btn-github">
        Sign in with GitHub
      </a>
      <!-- Add other providers as needed -->
    </div>
  </main>
</Layout>
```

```astro
---
// src/pages/dashboard.astro
import Layout from '@/layouts/Layout.astro';

// Protect this page
if (!Astro.locals.user) {
  return Astro.redirect("/signin");
}

const user = Astro.locals.user;
---

<Layout meta={{ title: "Dashboard" }}>
  <main>
    <h1>Welcome, {user.name}!</h1>
    <p>This is your protected dashboard.</p>
    
    <div class="user-info">
      <img src={user.image} alt={user.name} />
      <div>
        <p>Email: {user.email}</p>
      </div>
    </div>
    
    <a href="/api/auth/signout">Sign Out</a>
  </main>
</Layout>
```

## Conclusion

This architecture provides a solid foundation for building modern web applications with:

1. Astro framework for optimized content delivery and hybrid rendering
2. TailwindCSS for utility-first styling with shadcn UI components
3. Astro Actions for type-safe server functions
4. Drizzle ORM for type-safe database operations
5. Better Auth for flexible authentication flows

By combining these technologies, you can create applications that are:

- Performant with SSR/SSG capabilities
- Type-safe across the full stack
- Secure with proper authentication
- Maintainable with modern tooling
- Scalable for growing applications

This setup works well for a variety of applications from blogs and content sites to interactive web applications with user accounts and dynamic content.
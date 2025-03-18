## Drizzle ORM Adapter

Drizzle ORM is a powerful and flexible ORM for Node.js and TypeScript. It provides a simple and intuitive API for working with databases, and supports a wide range of databases including MySQL, PostgreSQL, SQLite, and more. Read more here: [Drizzle ORM](https://orm.drizzle.team/).

## Example Usage

Make sure you have Drizzle installed and configured. Then, you can use the Drizzle adapter to connect to your database.

auth.ts

```
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database.ts";
 
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "pg" or "mysql"
  }), 
  //... the rest of your config
});
```

## Schema generation & migration

The [Better Auth CLI](https://www.better-auth.com/docs/concepts/cli) allows you to generate or migrate your database schema based on your Better Auth configuration and plugins.

| Drizzle Schema Generation | Drizzle Schema Migration |
| --- | --- |
| ✅ Supported | ❌ Not Supported - Use Drizzle [migration command](https://orm.drizzle.team/docs/migrations) |

Schema Generation

```
npx @better-auth/cli@latest generate
```

Schema Migration

```
drizzle-kit migrate
```

## Additional Information

The Drizzle adapter expects the schema you define to match the table names. For example, if your Drizzle schema maps the `user` table to `users`, you need to manually pass the schema and map it to the user table.

```
import { betterAuth } from "better-auth";
import { db } from "./drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema } from "./schema";
 
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "pg" or "mysql"
    schema: {
      ...schema,
      user: schema.users,
    },
    //if all of them are just using plural form, you can just pass the option below
    usePlural: true,
  }),
});
```

If you're looking for performance improvements or tips, take a look at our guide to [performance optimizations](https://www.better-auth.com/docs/guides/optimizing-for-performance).

Other Relational Databases

Integrate Better Auth with other relational databases.

[View original](https://www.better-auth.com/docs/adapters/other-relational-databases)Prisma

Integrate Better Auth with Prisma.

[View original](https://www.better-auth.com/docs/adapters/prisma)

[Edit on GitHub](https://github.com/better-auth/better-auth/blob/main/docs/content/docs/adapters/drizzle.mdx)

Clipped on [[2025-03-18]]
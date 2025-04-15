# PostgreSQL Migration Guide

This document outlines the migration from Turso/SQLite to PostgreSQL for the ctxs.ai project.

## Database Configuration

The project now uses PostgreSQL for both development and production environments:

1. **Development**: Uses a local PostgreSQL database
2. **Production**: Will use a remote PostgreSQL database

## Environment Variables

The following environment variables are used:

- `DATABASE_URL`: PostgreSQL connection string (required)
  - Development default: `postgres://yourusername@localhost:5432/ctxs` (no password authentication)
  - Production: You need to provide this value with proper credentials

## Initial Setup

1. Install PostgreSQL locally
2. Create a database called `ctxs`:
   ```bash
   createdb ctxs
   ```
3. Grant necessary permissions to your user:
   ```bash
   psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE ctxs TO yourusername;"
   psql ctxs -c "GRANT ALL ON SCHEMA public TO yourusername;"
   psql ctxs -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO yourusername;"
   psql ctxs -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO yourusername;"
   psql ctxs -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO yourusername;"
   ```
4. Update your .env file with the correct connection string:
   ```
   DATABASE_URL=postgres://yourusername@localhost:5432/ctxs
   ```
5. Push the migrations to the database:
   ```bash
   bun run push
   ```

## Database Scripts

The following npm scripts are available:

- `bun run generate`: Generate new migrations
- `bun run push`: Push migrations to the database
- `bun run studio`: Open Drizzle Studio to view/edit data

## Schema Changes

The database schema has been migrated from SQLite to PostgreSQL format:

1. Changed `sqliteTable` to `pgTable`
2. Changed column definitions to include explicit column names
3. Changed timestamp fields to use PostgreSQL's native timestamp type
4. Changed integer primary keys to use `serial` type where appropriate
5. Updated foreign key relationships

## Production Deployment

When deploying to production:

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, Neon, etc.)
2. Set the `DATABASE_URL` environment variable to point to your production database
3. Run migrations on the production database with:
   ```bash
   NODE_ENV=production bun run push
   ```

## Project Files Modified

1. `src/db/schema.ts`: Updated schema definitions
2. `src/lib/db.ts`: Updated database connection logic
3. `drizzle.config.ts`: Updated to use PostgreSQL configuration
4. `src/lib/auth.ts`: Updated to use PostgreSQL adapter
5. `src/actions/index.ts`: Updated error handling for PostgreSQL
6. `.env` and `.env.template`: Added PostgreSQL configuration
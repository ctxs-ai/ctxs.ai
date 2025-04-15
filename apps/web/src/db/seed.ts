import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@ctxs/db';
import { Post, User } from '@ctxs/db';
import { Command } from 'commander';
import { customAlphabet } from 'nanoid';
import dotenv from 'dotenv';
import slugify from '@sindresorhus/slugify';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config();

const program = new Command();

// Configure command line arguments
program
  .option(
    '-f, --file <filePath>',
    'Path to the JSON file to import',
    './src/db/seed.json'
  )
  .parse(process.argv);

const options = program.opts();

// Initialize database connection
const setupDb = () => {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/ctxs_dev';
  console.log(`Connecting to database: ${connectionString}`);
  const client = postgres(connectionString);
  return drizzle(client, { schema });
};

const displayId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

// Main function to import JSON data to the database
const importJsonToDb = async () => {
  try {
    // Setup database
    const db = setupDb();

    // Read the JSON file
    const jsonFilePath = path.join(process.cwd(), options.file);
    if (!fs.existsSync(jsonFilePath)) {
      console.error(`Error: JSON file not found at ${jsonFilePath}`);
      console.error(
        'Run convert-contexts-to-json.ts first to generate the JSON data'
      );
      process.exit(1);
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    console.log(`Found ${jsonData.length} entries in the JSON file to import`);

    const [user] = await db
      .select({ id: User.id, githubUserName: User.githubUserName })
      .from(User)
      .where(eq(User.email, 'martinklepsch@googlemail.com'));

    // Import each entry
    const results = [];
    for (const entry of jsonData) {
      try {
        // Set the author ID from the command line
        const did = displayId();
        const postData = {
          ...entry,
          displayId: did,
          sourceUrl: entry.sourceUrl || null,
          slug: slugify(entry.title) + '-' + did,
          authorId: user.id,
          urn: `urn:ctxs:gh:${user.githubUserName}:${did}`,
          createdAt: new Date(entry.createdAt),
        };

        // Insert into database
        const result = await db
          .insert(Post)
          .values(postData)
          .returning({ id: Post.id });
        console.log(
          `Imported post ID: ${result[0]?.id}, title: ${entry.title}`
        );
        results.push({ id: result[0]?.id, title: entry.title });
      } catch (error) {
        console.error(
          `Error importing entry with title "${entry.title}":`,
          error
        );
        console.log(entry);
      }
    }

    console.log(
      `Successfully imported ${results.length} out of ${jsonData.length} entries`
    );

    // Exit when done
    process.exit(0);
  } catch (error) {
    console.error('Error importing JSON to database:', error);
    process.exit(1);
  }
};

// Run the import
importJsonToDb();

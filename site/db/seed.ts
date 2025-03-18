import { db, Posts } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Posts).values([
		{
			id: 1,
			title: "First Post",
			content: "This is our first post in the database!",
			createdAt: new Date()
		},
		{
			id: 2,
			title: "Second Post",
			content: "Another post to test with.",
			createdAt: new Date()
		}
	]);
}

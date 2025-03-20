import { sqliteTable, integer, text, blob, foreignKey } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const astroDbSnapshot = sqliteTable("_astro_db_snapshot", {
	id: integer().primaryKey({ autoIncrement: true }),
	version: text(),
	snapshot: blob(),
});

export const user = sqliteTable("user", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer().notNull(),
	image: text(),
	createdAt: text().notNull(),
	updatedAt: text().notNull(),
});

export const account = sqliteTable("account", {
	id: text().primaryKey(),
	userId: text().notNull().references(() => user.id),
	accountId: text().notNull(),
	providerId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	accessTokenExpiresAt: text(),
	refreshTokenExpiresAt: text(),
	scope: text(),
	idToken: text(),
	password: text(),
	createdAt: text().notNull(),
	updatedAt: text().notNull(),
});

export const session = sqliteTable("session", {
	id: text().primaryKey(),
	userId: text().notNull().references(() => user.id),
	token: text().notNull(),
	expiresAt: text().notNull(),
	ipAddress: text(),
	userAgent: text(),
	createdAt: text().notNull(),
	updatedAt: text().notNull(),
});

export const verification = sqliteTable("verification", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: text().notNull(),
	createdAt: text().notNull(),
	updatedAt: text().notNull(),
});

export const post = sqliteTable("post", {
	id: integer().primaryKey(),
	title: text().notNull(),
	content: text().notNull(),
	createdAt: text().default("2025-03-18T21:03:05.200Z").notNull(),
});


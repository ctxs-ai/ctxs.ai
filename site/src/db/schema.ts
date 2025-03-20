import { sqliteTable, integer, text, blob, foreignKey, unique } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const User = sqliteTable("user", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer().notNull(),
	image: text(),
	createdAt: text().notNull(),
	updatedAt: text().notNull(),
});

export const Account = sqliteTable("account", {
	id: text().primaryKey(),
	userId: text().notNull().references(() => User.id),
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

export const Session = sqliteTable("session", {
	id: text().primaryKey(),
	userId: text().notNull().references(() => User.id),
	token: text().notNull(),
	expiresAt: text().notNull(),
	ipAddress: text(),
	userAgent: text(),
	createdAt: text().notNull(),
	updatedAt: text().notNull(),
});

export const Verification = sqliteTable("verification", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: text().notNull(),
	createdAt: text().notNull(),
	updatedAt: text().notNull(),
});

export const Post = sqliteTable("post", {
	id: integer().primaryKey(),
	title: text(),
	description: text(),
	content: text().notNull(),
	createdAt: text().notNull(),
	authorId: text().notNull().references(() => User.id),
});

export const Vote = sqliteTable("vote", {
	id: integer().primaryKey(),
	createdAt: text().notNull(),
	userId: text().notNull().references(() => User.id),
	postId: text().notNull().references(() => Post.id),
}, (t) => [
	unique().on(t.userId, t.postId),
]);

// export const Comment = sqliteTable("comment", {
// 	id: integer().primaryKey(),
// 	createdAt: text().notNull(),
// 	userId: text().notNull().references(() => User.id),
// 	postId: text().notNull().references(() => Post.id),
// }, (t) => [
// 	unique().on(t.userId, t.postId),
// ]);


import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  primaryKey,
  unique,
  jsonb,
} from 'drizzle-orm/pg-core';

// Better-auth schema
export const User = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  githubUserName: text('github_user_name'),
});

export const Account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => User.id),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const Session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => User.id),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const Verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ctxs.ai schema
export const Post = pgTable('post', {
  id: serial('id').primaryKey(),
  displayId: text('display_id').notNull().unique(),
  slug: text('slug'),
  urn: text('urn').notNull().unique(),

  title: text('title'),
  description: text('description'),
  content: text('content').notNull(),
  contentFormat: text('content_format').notNull().default('markdown'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  authorId: text('author_id')
    .notNull()
    .references(() => User.id),
  targetFile: text('target_file'),
  tags: text('tags').array(),
  frontmatter: jsonb('frontmatter'),
  // provenance details - sometimes ai generated
  provenance: text('provenance'),
  sourceUrl: text('source_url'),
  attributedGitHubUser: text('attributed_github_user'),
  attributedXUser: text('attributed_x_user'),
  voteBump: integer('vote_bump').notNull().default(0),
});

export const Vote = pgTable(
  'vote',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: text('user_id')
      .notNull()
      .references(() => User.id),
    postId: integer('post_id')
      .notNull()
      .references(() => Post.id),
  },
  (t) => [unique().on(t.userId, t.postId)]
);

// export const Comment = pgTable("comment", {
// 	id: serial("id").primaryKey(),
// 	createdAt: timestamp("created_at").notNull().defaultNow(),
// 	userId: text("user_id").notNull().references(() => User.id),
// 	postId: integer("post_id").notNull().references(() => Post.id),
// }, (t) => [
// 	unique().on(t.userId, t.postId),
// ]);

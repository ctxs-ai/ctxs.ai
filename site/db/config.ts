import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config
const Posts = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    content: column.text(),
    createdAt: column.date({ default: new Date() })
  }
});

export default defineDb({
  tables: { Posts }
});

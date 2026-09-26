import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  topic: text('topic').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

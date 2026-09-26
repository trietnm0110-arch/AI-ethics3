import type { Config } from '@netlify/functions';
import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { chatMessages } from '../../db/schema.js';

export default async (req: Request) => {
  if (req.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  const sessionId = new URL(req.url).searchParams.get('sessionId');
  if (!sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId)) return Response.json({ messages: [] });

  const messages = await db.select({ id: chatMessages.id, role: chatMessages.role, content: chatMessages.content, topic: chatMessages.topic })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(asc(chatMessages.createdAt))
    .limit(80);
  return Response.json({ messages });
};

export const config: Config = { path: '/api/chat/history' };

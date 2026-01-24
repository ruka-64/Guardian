import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { bot } from '../bot';

const app = new Hono();
app.get('/', (c) => c.text('Hello!'));

app.get('/players', (c) => {
  const players: string[] = [];
  for (const player in bot.players) {
    players.push(player);
  }
  return c.json({
    success: true,
    players,
  });
});

serve({
  fetch: app.fetch,
  port: 6464,
});

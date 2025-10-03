import { logger } from 'comodern';
import { ActivityType, Client, IntentsBitField } from 'discord.js';
import { config } from '../../config';

export const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

client.on('ready', (client) => {
  logger.log(`${client.user.displayName} is ready.`);
  client.user.setPresence({
    activities: [
      {
        name: 'NewShirakaba',
        type: ActivityType.Competing,
      },
    ],
  });
});

client.login(config.discord.token);

process.on('SIGINT', client.destroy);
process.on('SIGTERM', client.destroy);

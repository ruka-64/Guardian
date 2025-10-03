import { logger } from 'comodern';
import { Client, IntentsBitField } from 'discord.js';
import { config } from '../../config';

export const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

client.on('ready', (client) => {
  logger.log(`${client.user.displayName} is ready.`);
});

client.login(config.discord.token);

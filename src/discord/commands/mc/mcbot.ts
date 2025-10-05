import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { config } from '../../../../config.js';
import { bot } from '../../../bot/index.js';
import { autoAttackEntity } from '../../../bot/utils/autoFight.js';
export const data = new SlashCommandBuilder()
  .setName('mcbot')
  .setDescription('Minecraft Bot Commands')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('send_chat')
      .setDescription('Send text to server chat')
      .addStringOption((opt) =>
        opt.setName('text').setDescription('Text').setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('autoclicker')
      .setDescription('AutoClicker')
      .addBooleanOption((opt) =>
        opt.setName('enabled').setDescription('is enabled').setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('money').setDescription('Show money')
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('throwxp').setDescription('Throw xp bottle')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  if (subcommand === 'send_chat') {
    if (!config.discord.whitelistedIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: 'No Perm',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const str = interaction.options.getString('text');
    if (!str) {
      await interaction.reply({
        content: 'text is required',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    bot.chat(str);
    await interaction.reply({
      content: `Successfully sent message: ${str}`,
      allowedMentions: { parse: [] },
    });
    return;
  }
  if (subcommand === 'autoclicker') {
    const bool = interaction.options.getBoolean('enabled')!;
    await interaction.reply(`Toggled (${bool})`);
    autoAttackEntity(bool);
    return;
  }
  if (subcommand === 'money') {
    const res = await new Promise<string>((resolve) => {
      bot.chat('/money');
      bot.on('messagestr', (msg) => resolve(msg));
    });
    await interaction.reply(`${res}`);
  }
  if (subcommand === 'throwxp') {
    if (!config.discord.whitelistedIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: 'No Perm',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await new Promise<string>((resolve) => {
      bot.chat('/xpm store max');
      bot.on('messagestr', (msg) => resolve(msg));
    });
    await interaction.reply('OK');
  }
}

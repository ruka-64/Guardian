import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { client } from '../../index.js';

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
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  if (subcommand === 'send_chat') {
    const str = interaction.options.getString('text');
    if (!str) {
      await interaction.reply({
        content: 'text is required',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await interaction.reply({
      content: `Successfully sent message: ${str}`,
      allowedMentions: { parse: [] },
    });
    return;
  }
}

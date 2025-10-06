import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { config } from '../../../../config.js';
import { bot } from '../../../bot/index.js';
import { autoAttackEntity } from '../../../bot/utils/autoFight.js';
import { ThrowItem } from '../../../bot/utils/inv.js';
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
    subcommand.setName('showinv').setDescription("display bot's inventory")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('drop')
      .setDescription('Drop item')
      .addStringOption((opt) =>
        opt.setName('item_id').setDescription('Item ID').setRequired(true)
      )
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
  if (subcommand === 'showinv') {
    const embed = new EmbedBuilder().setTitle('My inventory').setDescription(
      bot.inventory.slots
        .map((val) => {
          if (!val) return null;
          return `${val.displayName} (${val.name}) x${val.count}`;
        })
        .filter((val) => val !== null)
        .join('\n')
    );
  }
  if (subcommand === 'drop') {
    const id = interaction.options.getString('itemId');
    const result = await ThrowItem(id!);
    if (result) await interaction.reply('OK');
    else await interaction.reply('Invalid item id');
  }
}

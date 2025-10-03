import assert from 'assert';
import { client } from '..';
import { config } from '../../../config';
import { EmbedBuilder } from 'discord.js';

export async function SendAlert(mcid: string, uuid?: string) {
  const guild = client.guilds.cache.get(config.discord.guild);
  const channel = guild?.channels.cache.get(config.discord.channel);
  assert(channel?.isTextBased());
  const embed = new EmbedBuilder()
    .setTitle('侵入者を "確認しました"')
    .addFields(
      {
        name: 'MCID',
        value: mcid,
        inline: true,
      },
      {
        name: 'UUID',
        value: uuid ?? '不明',
        inline: true,
      }
    )
    .setThumbnail(uuid ? `https://api.creepernation.net/avatar/${uuid}` : null)
    .setColor('#ff0000ff')
    .setFooter({
      text: 'Guardian by ruka64',
    })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}

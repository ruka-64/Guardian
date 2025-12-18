import { logger } from 'comodern';
import { bot } from '..';
import { kv } from '../..';

let nowFishing = false;

async function onCollect(str: string) {
  //* +35.10$ +53.40XP +35.10pts
  if (str.includes('+') && str.includes('XP') && str.includes('pts')) {
    if (await kv.get('antispam')) return;
    logger.log('Fired');
    await kv.set('antispam', true, 1000 * 6);
    bot.removeListener('messagestr', onCollect);
    logger.log('Collected');
    await bot.waitForTicks(20);
    startFishing();
  }
}

export async function startFishing() {
  logger.log('Fishing');

  nowFishing = true;
  bot.on('messagestr', onCollect);
  const rod = bot.registry.itemsByName.fishing_rod;

  try {
    if (!bot.heldItem || bot.heldItem.name !== rod!.name) {
      await bot.equip(rod!.id, 'hand');
    }
    await bot.fish();
  } catch (err) {
    logger.log(err);
    // bot.on('messagestr', onCollect);
  }
  while (1) {
    try {
      logger.log('Loop fish');
      await bot.fish();
    } catch (err) {
      logger.log(err);
    }
  }
  nowFishing = false;
}

export function stopFishing() {
  bot.removeListener('messagestr', onCollect);

  if (nowFishing) {
    bot.activateItem();
  }
}

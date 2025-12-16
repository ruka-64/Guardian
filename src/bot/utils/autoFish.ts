import { logger } from 'comodern';
import { bot } from '..';

let nowFishing = false;

async function onCollect(player: any, entity: any) {
  if (entity.kind === 'Drops' && player === bot.entity) {
    bot.removeListener('playerCollect', onCollect);
    logger.log('Collected');
    await bot.waitForTicks(20);
    startFishing();
  }
}

export async function startFishing() {
  logger.log('Fishing');
  try {
    await bot.equip(bot.registry.itemsByName.fishing_rod!.id, 'hand');
  } catch (err) {
    return logger.log(err);
  }

  nowFishing = true;
  bot.on('playerCollect', onCollect);

  try {
    await bot.fish();
  } catch (err) {
    logger.log(err);
  }
  nowFishing = false;
}

export function stopFishing() {
  bot.removeListener('playerCollect', onCollect);

  if (nowFishing) {
    bot.activateItem();
  }
}

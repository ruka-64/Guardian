import { logger } from 'comodern';
import { bot } from '..';

let nowFishing = false;

async function onCollect(str:string) {
  logger.log('Fired');
  //* +35.10$ +53.40XP +35.10pts
  if (str.includes('+') && str.includes('XP') && str.includes('pts')) {
    bot.removeListener('messagestr', onCollect);
    logger.log('Collected');
    bot.deactivateItem();
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
  bot.on('messagestr', onCollect);

  try {
    await bot.fish();
  } catch (err) {
    logger.log(err);
  }
  nowFishing = false;
}

export function stopFishing() {
  bot.removeListener('messagestr', onCollect);

  if (nowFishing) {
    bot.activateItem();
  }
}

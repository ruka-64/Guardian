import { logger } from 'comodern';
import { bot } from '..';
import { wait } from '../..';

let autoclickerInterval: NodeJS.Timeout;

export const autoClicker = async (activate: boolean) => {
  const swordId = bot.registry.itemsByName.netherite_sword?.id;
  if (bot.registry.itemsByName.netherite_sword) {
    const sword = bot.inventory.findInventoryItem(swordId!, null, false);
    if (sword) {
      bot.setQuickBarSlot(0);
      bot.equip(sword, 'hand');
    }
  }
  if (activate) {
    autoclickerInterval = setInterval(async () => {
      logger.log('Clicking');
      await bot.clickWindow(0, 0, 0);
      logger.log('Clicked');
    }, 1000);
  } else {
    clearInterval(autoclickerInterval);
  }
};

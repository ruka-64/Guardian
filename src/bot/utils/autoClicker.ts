import { logger } from 'comodern';
import { bot } from '..';
import { wait } from '../..';

let autoclickerInterval: NodeJS.Timeout | null = null;

export const autoClicker = async (activate: boolean) => {
  const swordId = bot.registry.itemsByName.netherite_sword?.id;
  if (bot.registry.itemsByName.netherite_sword) {
    const sword = bot.inventory.findInventoryItem(swordId!, null, false);
    if (sword) {
      bot.setQuickBarSlot(0);
      bot.equip(sword, 'hand');
    }
  }
  autoclickerInterval = activate
    ? setInterval(async () => {
        logger.log('Clicking');
        await bot.clickWindow(0, 0, 0);
        logger.log('Clicked');
      }, 1000)
    : null;
};

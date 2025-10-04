import { logger } from 'comodern';
import { bot } from '..';
import { wait } from '../..';

let autoClickerState = false;

export const autoClicker = async (state: boolean) => {
  autoClickerState = state;
  const swordId = bot.registry.itemsByName.netherite_sword?.id;
  if (bot.registry.itemsByName.netherite_sword) {
    const sword = bot.inventory.findInventoryItem(swordId!, null, false);
    if (sword) {
      bot.setQuickBarSlot(0);
      bot.equip(sword, 'hand');
    }
  }
  const click = async () => {
    logger.log('Clicking');
    await bot.simpleClick.leftMouse(0);
    logger.log('Clicked');
    setTimeout(() => {
      click();
    }, 1000 * 6);
  };
  click();
};

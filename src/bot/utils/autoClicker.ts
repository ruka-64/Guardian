import { bot } from '..';

let autoClickerState = false;

export const autoClicker = (state: boolean) => {
  autoClickerState = state;
  const swordId = bot.registry.itemsByName.netherite_sword?.id;
  if (bot.registry.itemsByName.netherite_sword) {
    const sword = bot.inventory.findInventoryItem(swordId!, null, false);
    if (sword) {
      bot.setQuickBarSlot(0);
      bot.equip(sword, 'hand');
    }
  }
  while (autoClickerState) {
    setTimeout(async () => {
      await bot.simpleClick.leftMouse(0);
    }, 1000 * 6);
  }
};

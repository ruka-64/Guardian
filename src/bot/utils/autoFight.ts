import { logger } from 'comodern';
import { bot } from '..';

let attackInterval: NodeJS.Timeout;
export let autoFightState = false;

export const autoAttackEntity = async (activate: boolean, move = false) => {
  autoFightState = activate;
  if (activate) {
    const swordId = bot.registry.itemsByName.netherite_sword?.id;
    if (bot.registry.itemsByName.netherite_sword) {
      const sword = bot.inventory.findInventoryItem(swordId!, null, false);
      if (sword) {
        bot.setQuickBarSlot(0);
        bot.equip(sword, 'hand');
      }
    }
    if (move) {
      bot.setControlState('forward', true);
      await bot.waitForTicks(15);
      bot.setControlState('forward', false);
    }
    attackInterval = setInterval(async () => {
      if (bot.autoEat.isEating) return;
      const entity = bot.nearestEntity((e) => {
        return (
          e.type === 'hostile' &&
          e.position.xzDistanceTo(bot.entity.position) < 3 &&
          e.position.y - bot.entity.position.y < 2 &&
          e.name !== 'dog' &&
          e.name !== 'cat'
        );
      });
      if (entity) {
        await bot.lookAt(entity.position);
        await bot.waitForTicks(1);
        bot.attack(entity);
      }
    }, 6000);
  } else {
    clearInterval(attackInterval);
    logger.info('Calling /home botpos');
    bot.chat('/home botpos');
  }
};

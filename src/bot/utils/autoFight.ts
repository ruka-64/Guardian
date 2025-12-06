import { logger } from 'comodern';
import { bot } from '..';
import { config } from '../../../config';

let attackInterval: NodeJS.Timeout;
export let autoFightState = false;

const equipSword = () => {
  const swordId = bot.registry.itemsByName[config.mc.sword_name]?.id;
  if (bot.registry.itemsByName[config.mc.sword_name]?.id) {
    const sword = bot.inventory.findInventoryItem(swordId!, null, false);
    if (sword) {
      bot.setQuickBarSlot(0);
      bot.equip(sword, 'hand');
    }
  }
};

export const autoAttackEntity = async (activate: boolean, move = false) => {
  autoFightState = activate;
  if (activate) {
    if (move) {
      bot.setControlState('forward', true);
      await bot.waitForTicks(15);
      bot.setControlState('forward', false);
    }
    equipSword();
    attackInterval = setInterval(async () => {
      if (bot.autoEat.isEating) return;
      equipSword();
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
    }, config.mc.autoFightDelay ?? 4000);
  } else {
    clearInterval(attackInterval);
    logger.info('Calling /home botpos');
    bot.chat('/home botpos');
  }
};

import { logger } from 'comodern';
import { bot } from '..';

let attackInterval: NodeJS.Timeout;

export const autoAttackEntity = async (activate: boolean) => {
  if (activate) {
    bot.setControlState('forward', true);
    await bot.waitForTicks(3);
    bot.setControlState('forward', false);
    attackInterval = setInterval(async () => {
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
        logger.log(`Attacking ${entity.name ?? entity.username}`);
        logger.log(
          `XZ Distance: ${entity.position.xzDistanceTo(bot.entity.position)}`
        );
        await bot.lookAt(entity.position.offset(0, 0, 0));
        await bot.waitForTicks(1);
        bot.attack(entity);
      }
    }, 1000);
  } else {
    clearInterval(attackInterval);
    bot.chat('/home botpos');
  }
};

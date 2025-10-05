import { logger } from 'comodern';
import { bot } from '..';

let attackInterval: NodeJS.Timeout;

export const autoAttackEntity = (activate: boolean) => {
  if (activate) {
    attackInterval = setInterval(() => {
      const entity = bot.nearestEntity((e) => {
        console.log(
          '(e,xz,y)',
          e.name,
          e.position.xzDistanceTo(bot.entity.position),
          bot.entity.position.y - e.position.y
        );
        return (
          e.type != 'player' &&
          e.type != 'orb' &&
          e.type != 'object' &&
          e.type != 'projectile' &&
          e.type != 'hostile' &&
          e.position.xzDistanceTo(bot.entity.position) < 5 &&
          e.position.y - bot.entity.position.y < 2 &&
          e.name !== 'dog' &&
          e.name !== 'cat'
        );
      });
      if (entity) {
        logger.log(`Attacking ${entity.name ?? entity.username}`);
        const pos = bot.lookAt(entity.position.offset(0, -1.5, 0));
        bot.attack(entity);
      }
    }, 1000);
  } else {
    clearInterval(attackInterval);
  }
};

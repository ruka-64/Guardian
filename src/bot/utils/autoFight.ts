import { logger } from 'comodern';
import { bot } from '..';

let attackInterval: NodeJS.Timeout;

export const autoAttackEntity = (activate: boolean) => {
  if (activate) {
    attackInterval = setInterval(() => {
      const entity = bot.nearestEntity((e) => {
        console.log('xzDistance', e.position.xzDistanceTo);
        console.log('ydiff', e.position.y - bot.entity.position.y);
        return (
          e.type == 'mob' &&
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

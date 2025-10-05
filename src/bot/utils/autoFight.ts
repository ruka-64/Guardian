import { logger } from 'comodern';
import { bot } from '..';

let attackInterval: NodeJS.Timeout | null;

export const autoAttackEntity = (activate: boolean) => {
  attackInterval = activate
    ? setInterval(() => {
        const entity = bot.nearestEntity((e) => {
          return (
            e.type == 'mob' &&
            e.position.distanceTo(bot.entity.position) < 5 &&
            e.name !== 'dog' &&
            e.name !== 'cat'
          );
        });
        if (entity) {
          logger.log(`Attacking ${entity.name ?? entity.username}`);
          bot.attack(entity);
        }
      }, 1000)
    : null;
};

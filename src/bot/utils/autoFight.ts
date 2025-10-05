import { logger } from 'comodern';
import { bot } from '..';

let attackInterval: NodeJS.Timeout | null;

export const autoAttackEntity = (activate: boolean) => {
  attackInterval = activate
    ? setInterval(() => {
        const entity = bot.nearestEntity((e) => {
          return (
            e.type !== 'player' &&
            e.position.xzDistanceTo(bot.entity.position) < 5 &&
            e.name !== 'item'
          );
        });
        if (entity) {
          logger.log(`Attacking ${entity.name ?? entity.username}`);
          bot.attack(entity);
        }
      }, 1000)
    : null;
};

import type { Vec3 } from 'vec3';
import { bot } from '..';
import { logger } from 'comodern';

export const moveToGoal = (pos: Vec3) => {
  return new Promise<true>(async (_) => {
    logger.log('Looking');
    await bot.lookAt(pos);
    await bot.waitForTicks(5);
    while (1) {
      await bot.waitForChunksToLoad();

      if (!bot.getControlState('forward')) {
        logger.log('Started walking');
        bot.setControlState('sprint', true);
        bot.setControlState('forward', true);
      }
      logger.log('Wait 5ticks');
      await bot.waitForTicks(5);
      logger.log('Calc...');
      const curr = bot.player.entity.position;
      logger.log('Calc result:', curr.distanceTo(pos));
      logger.log('amIwalking', bot.getControlState('forward'));
      if (curr.distanceTo(pos) < 1) {
        bot.setControlState('sprint', false);
        bot.setControlState('forward', false);
        logger.log('Done moving');
        break;
      }
    }
    _(true);
  });
};

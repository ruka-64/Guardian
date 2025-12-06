import { Vec3, type Vec3 as Vec3T } from 'vec3';
import { bot } from '..';
import { logger } from 'comodern';

export const moveToGoal = (pos: Vec3T) => {
  return new Promise<true>(async (_) => {
    let flagged = false;
    let c = 0;

    let fc = 0;
    bot.on('forcedMove', () => {
      fc++;
      // logger.warn('forcedMove detected!! Count:', fc);
      if (fc > 10) {
        fc = 0;
        flagged = true;
      }
      const before = fc;
      setTimeout(() => {
        if (before === fc) {
          // logger.log('Clear count');
          fc = 0;
        }
      }, 5000);
    });

    logger.log('Looking');
    await bot.lookAt(pos);
    await bot.waitForTicks(5);
    while (1) {
      if (flagged) {
        logger.warn('Flagged! trying to bypass...');
        bot.setControlState('forward', false);
        const botpos = bot.entity.position;
        await bot.lookAt(new Vec3(botpos.x, -100, botpos.z));
        await bot.waitForTicks(20);
        await bot.lookAt(pos);
        flagged = false;
        logger.info('Continue');
      }
      if (c % 5 === 0) {
        bot.setControlState('forward', false);
        await bot.waitForTicks(10);
        await bot.lookAt(pos);
      }
      if (!bot.getControlState('forward')) bot.setControlState('forward', true);
      const distance = bot.player.entity.position.distanceTo(pos);
      logger.log('Walking. distance:', distance);
      if (distance < 1) {
        bot.setControlState('forward', false);
        logger.log('Done walking');
        break;
      }
      await bot.waitForTicks(5);
      c++;
    }
    _(true);
  });
};

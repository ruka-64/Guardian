import { Vec3 } from 'vec3';
import { bot } from '..';
import { moveToGoal } from './moveToGoal';
import { logger } from 'comodern';

function blockToSow() {
  return bot.findBlock({
    point: bot.entity.position,
    matching: bot.registry.blocksByName.farmland!.id,
    maxDistance: 6,
    useExtraInfo: (block) => {
      const blockAbove = bot.blockAt(block.position.offset(0, 1, 0));
      return !blockAbove || blockAbove.type === 0;
    },
  });
}

function blockToHarvest() {
  return bot.findBlock({
    point: bot.entity.position,
    maxDistance: 6,
    matching: (block) => {
      return (
        block &&
        block.type === bot.registry.blocksByName.wheat!.id &&
        block.metadata === 7
      );
    },
  });
}

export async function farm(): Promise<true> {
  try {
    while (1) {
      const toHarvest = blockToHarvest();
      if (toHarvest) {
        logger.log('Moving');
        await moveToGoal(toHarvest.position);
        logger.log('Looking');
        await bot.lookAt(toHarvest.position);
        logger.log('Digging');
        await bot.dig(toHarvest);
        logger.log('Done');
      } else {
        logger.log('Break loop toHarvest');
        break;
      }
    }
    while (1) {
      const toSow = blockToSow();
      if (toSow) {
        logger.log('Moving');
        await moveToGoal(toSow.position);
        logger.log('Looking');
        await bot.lookAt(toSow.position);
        logger.log('Placing');
        await bot.equip(bot.registry.itemsByName.wheat_seeds!.id, 'hand');
        await bot.placeBlock(toSow, new Vec3(0, 1, 0));
      } else {
        logger.log('Break loop toSow');
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }

  return true;

  // No block to harvest or sow. Postpone next loop a bit
  // setTimeout(loop, 1000);
}

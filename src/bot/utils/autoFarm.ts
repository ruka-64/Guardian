import { Vec3 } from 'vec3';
import { bot } from '..';
import { goals, Movements } from 'mineflayer-pathfinder';

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
        bot.pathfinder.setMovements(new Movements(bot));
        const loc = {
          x: toHarvest.position.x,
          y: toHarvest.position.y,
          z: toHarvest.position.z,
        };
        await bot.pathfinder.goto(new goals.GoalBlock(loc.x, loc.y, loc.z));
        await bot.lookAt(toHarvest.position);
        await bot.dig(toHarvest);
      } else {
        break;
      }
    }
    while (1) {
      const toSow = blockToSow();
      if (toSow) {
        bot.pathfinder.setMovements(new Movements(bot));
        const loc = {
          x: toSow.position.x,
          y: toSow.position.y,
          z: toSow.position.z,
        };
        await bot.pathfinder.goto(new goals.GoalBlock(loc.x, loc.y, loc.z));
        await bot.lookAt(toSow.position);
        await bot.equip(bot.registry.itemsByName.wheat_seeds!.id, 'hand');
        await bot.placeBlock(toSow, new Vec3(0, 1, 0));
      } else {
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

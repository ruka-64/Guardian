import { bot } from '..';
import { config } from '../../../config';
import type { Bot } from 'mineflayer';

export class autoFightModule {
  public running: boolean;
  private attackInterval: NodeJS.Timeout | null;
  private bot: Bot;
  constructor(bot: Bot) {
    this.bot = bot;
    this.attackInterval = null;
    this.running = false;
  }
  async startAttacking(walk: boolean = true) {
    this.running = true;

    if (walk) {
      bot.setControlState('forward', true);
      await bot.waitForTicks(15);
      bot.setControlState('forward', false);
    }

    this.attackInterval = setInterval(async () => {
      if (bot.autoEat.isEating) return;
      this.equipWeapon();
      const entity = bot.nearestEntity((e) => {
        return (
          e.type === 'hostile' &&
          e.position.xzDistanceTo(bot.entity.position) < 3 &&
          e.position.y - bot.entity.position.y < 2
        );
      });
      if (entity) {
        await bot.lookAt(entity.position);
        await bot.waitForTicks(1);
        bot.attack(entity);
      }
    }, config.mc.autoFightDelay ?? 4000);
  }
  stopAttacking(goback: boolean = true) {
    this.running = false;
    if (this.attackInterval) {
      clearInterval(this.attackInterval);
      this.attackInterval = null;
      if (goback) this.goBotPos();
    }
  }

  private goBotPos() {
    bot.chat('/home botpos');
  }

  private equipWeapon() {
    if (bot.heldItem && bot.heldItem.name == config.mc.sword_name) return;
    const swordId = bot.registry.itemsByName[config.mc.sword_name]?.id;
    if (bot.registry.itemsByName[config.mc.sword_name]?.id) {
      const sword = bot.inventory.findInventoryItem(swordId!, null, false);
      if (sword) {
        bot.setQuickBarSlot(0);
        bot.equip(sword, 'hand');
      }
    }
  }
}

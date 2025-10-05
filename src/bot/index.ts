import { createBot, type Bot } from 'mineflayer';
import { config } from '../../config';
import { logger } from 'comodern';
import { kv, wait } from '..';
import { SendAlert, SendText } from '../discord/utils/notifier';
import { loader as autoEat } from 'mineflayer-auto-eat';
import { autoAttackEntity, autoFightState } from './utils/autoFight';
import { InvCleaner, isInvFull } from './utils/inv';

export let isReady = false;
export let bot: Bot;

export function mcbot(shouldInit: boolean = false) {
  const waitForTeleport = () => {
    return new Promise<true>((resolve) => {
      bot.on('forcedMove', () => resolve(true));
    });
  };
  bot = createBot({
    host: 'marvgame.net',
    port: 25565,
    username: config.email,
    auth: 'microsoft',
    version: '1.21.1',
    physicsEnabled: true,
  });

  logger.info(`My master is ${config.master.mcid}.`);

  bot.on('chat', (username, msg) => {
    logger.log(`<${username}> ${msg}`);
  });

  bot.once('spawn', async () => {
    bot.loadPlugin(autoEat);
    bot.autoEat.enableAuto();

    logger.log('Joined');
    await wait(500);
    bot.chat('/msg ruka64 hello');
    await bot.waitForTicks(20);
    logger.log('Moving to NeoSigen');
    bot.chat('/server NeoSigen');
    await waitForTeleport();
    logger.log('Moved to NeoSigen');
    if (shouldInit) {
      await bot.waitForChunksToLoad();
      bot.chat(`/tpa ${config.master.mcid}`);
      logger.log('awaiting your tpa request');
      await waitForTeleport();
      await bot.waitForChunksToLoad();
      bot.chat('/sethome botpos');
    } else {
      bot.chat('/home botpos');
    }
    logger.info(`${bot.username ?? 'Bot'} is ready!`);
    await SendText(`Connected! (logged in as ${bot.username})`, true);
    isReady = true;
  });

  bot.on('physicsTick', async () => {
    if (!isReady) return;
    const entity = bot.nearestEntity((e) => {
      return (
        e.type === 'player' &&
        e.position.distanceTo(bot.entity.position) < 64 &&
        e.displayName !== 'Armor Stand'
      );
    });
    //
    if (entity && entity.username) {
      if (config.mc.whitelist.includes(entity.username)) return;
      const kvData = await kv.get(entity.username);
      if (kvData !== 0) {
        await kv.set(entity.username, 0, 1000 * 60 * 5);
        await SendAlert(entity.username, entity.uuid);
      }
    }
  });

  //TODO: Auto accepting tpa request
  bot.on('messagestr', async (msg) => {
    const tpa_regex = /(.+) has requested to teleport to you./;
    const tell_regex = /\[(.+) -> me\] (.+)/;
    if (msg.endsWith('has requested to teleport to you.')) {
      const match = msg.match(tpa_regex);
      if (match) {
        if (config.mc.whitelist.includes(match[1]!)) {
          logger.log(`Accepting ${match[1]}'s tpa request...`);
          bot.chat('/tpaccept');
        }
      }
    }
    if (msg.startsWith('[')) {
      const match = msg.match(tell_regex);
      if (match) {
        logger.log('Tell', msg);
        if (match[2] === 'invcleaner') {
          await InvCleaner();
          bot.chat(`/msg ${match[1]} Done.`);
          return;
        }
        if (match[2] === 'xp') {
          if (isInvFull()) {
            bot.chat(`/msg ${match[1]} My inv is full (try invcleaner)`);
          }
          await new Promise<string>((resolve) => {
            bot.chat('/xpm store max');
            bot.on('messagestr', (msg) => resolve(msg));
          });
          const isAuto = autoFightState;
          if (isAuto) autoAttackEntity(false);
          logger.log('Finding xp bottle...');
          const expId = bot.registry.itemsByName.experience_bottle!.id;
          if (bot.registry.itemsByName.experience_bottle) {
            const exp = bot.inventory.findInventoryItem(expId, null, false);
            if (exp) {
              logger.log(`Finding ${match[1]}...`);
              const player = bot.entities[match[1]!];
              if (!player) {
                bot.chat(`/msg ${match[1]} I can't find you...`);
                return;
              }
              const currVec3 = bot.entity.position;
              await bot.lookAt(player.position);
              await bot.waitForTicks(1);
              await bot.toss(exp.type, null, null);
              bot.chat(`/msg ${match[1]} Go ahead!`);
              await bot.lookAt(currVec3);
              logger.log(`I gave xp to ${match[1]}`);
            } else {
              logger.log('Cannot find xp bottle');
              bot.chat(`/msg ${match[1]} I don't have xp bottle...`);
            }
          }
          if (isAuto) autoAttackEntity(true);
          return;
        } else await SendText(`[Tell] ${msg}`);
      }
    }
    logger.log('msg', msg);
  });

  bot.on('forcedMove', () => {
    logger.info('ForcedMove detected.');
    logger.log('Current location is: ', bot.entity.position);
  });

  bot.on('kicked', async (reason, loggedIn) => {
    logger.warn(`I was kicked... reason: ${reason} (LoggedIn: ${loggedIn})`);
    await SendText(
      `I was kicked :( (reason: ${reason}) trying to reconnect...`,
      true
    );
    logger.log('Reconnecting after 5 seconds...');
    await wait(5000);
    return mcbot();
  });
  bot.on('error', (err) => {
    if (err.message === 'PartialReadError') return;
    else console.error(err);
  });
  bot.on('end', async (reason) => {
    await SendText(
      `I was disconnected (reason: ${reason})! trying to reconnect...`,
      true
    );
    logger.info(`End event detected (reason: ${reason})`);
    logger.log('Reconnecting after 5 seconds...');
    await wait(5000);
    return mcbot();
  });
  bot.on('death', async () => {
    await SendText(`<@${config.master.discorduId}> I was died! respawning...`);
    bot.chat('/home botpos');
  });
}

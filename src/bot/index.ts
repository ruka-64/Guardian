import { createBot, type Bot } from 'mineflayer';
import { config } from '../../config';
import { logger } from 'comodern';
import { kv, wait } from '..';
import { SendAlert, SendText } from '../discord/utils/notifier';
import { loader as autoEat } from 'mineflayer-auto-eat';

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
  bot.on('messagestr', (msg) => {
    const tpa_regex = msg.match(/(.+) has requested to teleport to you./);
    if (tpa_regex) {
      if (config.mc.whitelist.includes(tpa_regex[0])) {
        logger.log(`Accepting ${tpa_regex[0]}'s tpa request...`);
        bot.chat('/tpaccept');
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

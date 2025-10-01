import { createBot } from 'mineflayer';
import { config } from '../config';
import { logger } from 'comodern';

const wait = (ms: number) => new Promise((_) => setTimeout(_, ms));

const waitForTeleport = () => {
  return new Promise<true>((resolve) => {
    bot.on('forcedMove', () => resolve(true));
  });
};

const shouldInit = false;

const bot = createBot({
  host: 'marvgame.net',
  port: 25565,
  username: config.email,
  // password: config.password,
  auth: 'microsoft',
  version: '1.21.1',
});

logger.info(`My master is ${config.master.mcid}.`);

bot.on('chat', (username, msg) => {
  logger.log(`<${username}> ${msg}`);
  //
});

bot.once('spawn', async () => {
  logger.log('Joined');
  await wait(500);
  bot.chat('/msg ruka64 hello');
  // logger.log('Waiting for load chunks');
  // await bot.waitForChunksToLoad();
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
});

bot.on('message', (msg, pos) => {
  // console.log(msg.json);
  if (msg.json.extra && msg.json.extra.length > 0) {
    if (
      msg.json.text === config.master.mcid &&
      msg.json.extra[0].text === ' has requested to teleport to you.'
    ) {
      logger.log('Accepting tpa req');
      bot.chat('/tpaaccept');
    }
  }
});

bot.on('forcedMove', () => {
  logger.info('ForcedMove detected.');
  logger.log('Current location is: ', bot.entity.position);
});

bot.on('kicked', console.log);
bot.on('error', (err) => {
  if (err.message === 'PartialReadError') return;
  else console.error(err);
});

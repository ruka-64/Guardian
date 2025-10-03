import Keyv from 'keyv';
import { config } from '../config';

export const kv = new Keyv<number | undefined>();

async function main() {
  import('./discord/index');
  (await import('./bot/index')).mcbot(config.mc.shouldInit);
}

main();

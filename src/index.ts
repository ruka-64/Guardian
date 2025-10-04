import Keyv from 'keyv';
import { config } from '../config';

export const kv = new Keyv<number | undefined>();
export const wait = (ms: number) => new Promise((_) => setTimeout(_, ms));

async function main() {
  import('./discord/index');
  (await import('./bot/index')).mcbot(config.mc.shouldInit);
}

main();

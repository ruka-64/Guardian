import Keyv from 'keyv';

export const kv = new Keyv<number | undefined>();

async function main() {
  import('./discord/index');
  (await import('./bot/index')).mcbot();
}

main();

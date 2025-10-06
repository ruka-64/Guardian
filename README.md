# Guardian - Useful base defender for MARV

## Why I made this

Recently, I playing Minecraft at [MARV](https://marvgame.com/).

I enjoying this server but me and friends are troubled by encroacher so I made this bot.

## How it works / Usage

Guardian checking near players every tick and send alert if detected player.

This bot runs discord bot and provides the following commands:
* `/ping` - Returns pong.
* `/mcbot bot_chat <str>` - Send text to chat.
* `/mcbot autoclicker <bool>` - Auto Clicker for TT.
* `/mcbot money` - Show current balance.

Also, you can use the following commands by `/msg <bot_mcid> <commandName>`:
* `invcleaner` - Clean the bot's inventory.
* `xp` - Throw exp bottle.

## Running yourself

Requires Node.js (`>= 22`) and `pnpm`.

1. Clone this repository.
2. copy `config.ts.example` as `config.ts` and edit it.
3. Install deps with `pnpm i`.
4. Run with `pnpm run start`.
5. (If it's first time) Login to Minecraft account.
6. enjoy!

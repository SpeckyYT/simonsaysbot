# Simon Says Discord Bot
A fully customizable Discord recreation of the popular "Simon Says" game. Made for Discord Hack Week.

Created by: `Manteex#6804`, `SputNix#6119`.

## Installation and use
Insert your bot's token in the `token` property of `config.json`. You're ready to start! The default prefix for the bot is `!` (but you can change that using `!config prefix set <prefix>`).

Type `!start` to start the game, you will be guided through everything else by the bot itself.

You can change a lot of settings with `!config`, for example minigame types and different tasks (full info can be found with `!help config`). We've provided as much as possible for the best experience for each community!

## Simon Says rules
This is a text game where people should do what Simon says, meaning they should not do anything if Simon didn't say that or if someone else aside from Simon said that.

There is an 'Opposite day' event though, during which players should listen to everyone else except Simon, so beware!

If someone doesn't properly complete a task, they fall out of the game. The last person staying in the game wins. Good luck!

## Examples
### User has completed the task properly

**Bot**: Simon says write this in chat: hi

**User**: hi

### User will fall out of the game because Simoon said instead of Simon

**Bot**: Simoon says write this in chat: i love this bot

**User**: i love this bot

## Commands
`help` shows info about the bot

`help <command>` shows info about a command

`start <#channel>` starts the game in specific channel

`config` provides server owner a plenty of customizable options for the game

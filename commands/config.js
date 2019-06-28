const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: ['config'],
    type: 'all',
    help: 'Configure the game for your own server.\n\n`config minigames view` see list of enabled minigames for this server\n`config minigames enable <minigame>`\n`config minigames disable <minigame>`\n`config prefix view` see current bot\'s prefix\n`config prefix set` change prefix for this server\n`config fakeStarts add <text>` adds a fake start of a "Simon says" message. For example, "Simoon says".\n`config fakeStarts remove <text>`\n`config fakeStarts view`\n`config tasks view` to view all settings\n`config tasks add <task type> <task argument>`\n`config tasks remove <task type> <task argument>`\nTask types: `say` (send message), `react` (put a reaction to the task message), `nickname` (set a nickname on the server), `status` (set status, can be online/idle/dnd/offline)\nTask argument is the text required for a task, nickname, status etc.\n\nYou can shorten the arguments to a single character (`tasks` -> `t`) for more convenient use.',

    execute(client, message, words) {
        var config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}.json`))

        switch (words[1]) {
            case "minigames":
            case "m":
                switch (words[2]) {
                    case "view":
                    case "v":
                    case "list":
                    case "l":
                        var list = "Enabled minigames: ";
                        for (let t in config.minigames) {
                            if (config.minigames[t])
                                list += ` \`${t}\` `;
                        };
                        const gameFiles = fs.readdirSync('./minigames').filter(file => file.endsWith('.js'))
                        var availableMinigames = [];
                        for (const file of gameFiles) {
                            availableMinigames.push(file.replace('.js', ''));
                        }
                        list += `\nAvailable minigames: \`${availableMinigames.join("`  `")}\``
                        message.channel.send(list);
                        break;
                    case "enable":
                    case "e":
                        var arg = message.content.substring(words[0].length + words[1].length + words[2].length + 3);
                        if (config.minigames[arg] == undefined)
                            message.reply(`Wrong minigame name. Type \`${config.prefix}config minigames view\` for more info.`)
                        else {
                            config.minigames[arg] = true;
                            fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                            message.reply(`Successfully enabled the minigame \`${arg}\`.`);
                        }
                        break;
                    case "disable":
                    case "d":
                        var arg = message.content.substring(words[0].length + words[1].length + words[2].length + 3);
                        if (config.minigames[arg] == undefined)
                            message.reply(`Wrong minigame name. Type \`${config.prefix}config minigames view\` for more info.`)
                        else {
                            config.minigames[arg] = false;
                            fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                            message.reply(`Successfully disabled the minigame \`${arg}\`.`);
                        }
                        break;
                }
                break;
            case "prefix":
            case "p":
                switch (words[2]) {
                    case "view":
                    case "v":
                        message.channel.send(`The current prefix for the server "${message.guild.name}" is \`${config.prefix}\``)
                        break;
                    case "set":
                    case "s":
                        var newPrefix = message.content.substring(words[0].length + words[1].length + words[2].length + 3)
                        config.prefix = newPrefix;
                        fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                        message.reply(`Successfully changed the prefix for the server "${message.guild.name}" to \`${newPrefix}\``);
                        break;
                    default:
                        message.reply(`Unknown action. Type \`${config.prefix}help config\` for more info.`)
                }
                break;
            case "fakeStarts":
            case "f":
                switch (words[2]) {
                    case "view":
                    case "v":
                    case "list":
                    case "l":
                        var list = "Fake message starts list.\n";
                        config.fakeStarts.forEach(t => {
                            list += ` \`${t}\` `;
                        });
                        message.channel.send(list);
                        break;
                    case "add":
                    case "a":
                    case "insert":
                    case "i":
                        var arg = message.content.substring(words[0].length + words[1].length + words[2].length + 3);
                        config.fakeStarts.push(arg);
                        fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                        message.reply(`Successfully added a fake message start \`${arg}\``);
                        break;
                    case "remove":
                    case "r":
                    case "delete":
                    case "d":
                        var arg = message.content.substring(words[0].length + words[1].length + words[2].length + 3);
                        var index_to_replace = config.fakeStarts.findIndex(t => t == arg);
                        config.fakeStarts[index_to_replace] = config.fakeStarts[config.fakeStarts[words[2].length - 1]];
                        config.fakeStarts.pop();
                        fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                        message.reply(`Successfully removed a fake message start \`${arg}\``);
                        break;
                    default:
                        message.reply(`Unknown action. Type \`${config.prefix}help config\` for more info.`);
                        break;
                }
                break;

            case "tasks":
            case "t":
                switch (words[2]) {
                    case "view":
                    case "v":
                    case "list":
                    case "l":
                        var list = "Task list.\n";

                        list += "\n**say**   "
                        config.tasks.say.forEach(t => {
                            list += ` \`${t}\` `;
                        });

                        list += "\n**react**   "
                        config.tasks.react.forEach(t => {
                            list += ` \`${t}\` `;
                        });

                        list += "\n**nickname**   "
                        config.tasks.nickname.forEach(t => {
                            list += ` \`${t}\` `;
                        });

                        list += "\n**status**   "
                        config.tasks.status.forEach(t => {
                            list += ` \`${t}\` `;
                        });
                        message.channel.send(list);
                        break;
                    case "add":
                    case "a":
                    case "insert":
                    case "i":
                        var arg = message.content.substring(words[0].length + words[1].length + words[2].length + words[3].length + 4);
                        switch (words[3]) {
                            case "say":
                            case "react":
                            case "status":
                                config.tasks[words[3]].push(arg);
                                fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                                message.reply(`Successfully added a task \`${words[3]}\` with the argument of \`${arg}\`.`);
                                break;
                            default:
                                message.reply(`Unknown task type. Type \`${config.prefix}help config\` for more info.`);
                        }
                        break;
                    case "remove":
                    case "r":
                    case "delete":
                    case "d":
                        switch (words[3]) {
                            case "say":
                            case "react":
                            case "status":
                                var arg = message.content.substring(words[0].length + words[1].length + words[2].length + words[3].length + 4);
                                var index_to_replace = config.tasks[words[3]].findIndex(t => t == arg);
                                config.tasks[words[3]][index_to_replace] = config.tasks[words[3]][config.tasks[words[3].length - 1]];
                                config.tasks[words[3]].pop();
                                fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                                message.reply(`Successfully removed a task \`${words[3]}\` with the argument of \`${arg}\`.`);
                                break;
                            default:
                                message.reply(`Unknown task type. Type \`${config.prefix}help config\` for more info.`);
                                break;
                        }
                        break;
                    default:
                        message.reply(`Unknown action. Type \`${config.prefix}help config\` for more info.`);
                        break;
                }
                break;
            default:
                message.reply(`Unknown action. Type \`${config.prefix}help config\` for more info.`);
                break;
        }
    }
}
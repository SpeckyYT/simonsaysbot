const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: ['config'],
    type: 'all',
    help: 'Configure the game for your own server.\n\n`config fakeStarts add <text>` adds a fake start of a "Simon says" message. For example, "Simoon says".\n`config fakeStarts remove <text>`\n`config fakeStarts view`\n`config tasks view` to view all settings\n`config tasks add <task type> <task argument>`\n`config tasks remove <task type> <task argument>`\nTask types: `say` (send message), `react` (put a reaction to the task message), `nickname` (set a nickname on the server), `status` (set status, can be online/idle/dnd/offline)\nTask argument is the text required for a task, nickname, status etc.\n\nYou can use `t` as an alias for `tasks`; `f` for `fakeStarts`; `insert`, `i`, `a` for `add`; `delete`, `d`, `r` for `remove`; `list`, `l`, `v` for `view`.',

    execute(client, message, words) {
        var config = JSON.parse(fs.readFileSync(`config.json`)).default_settings;
        fs.open(`./guilds/${message.guild.id}.json`, 'r', (err, fd) => {
            if (err) fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config))
            else
                config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}.json`))
        })

        switch (words[1]) {
            case "fakeStarts":
            case "f":
                switch (words[2]) {
                    case "view":
                    case "v":
                    case "list":
                    case "l":
                        let list = "Fake message starts list.\n";
                        config.fakeStarts.status.forEach(t => {
                            list += ` \`${t}\` `;
                        });
                        message.channel.send(list);
                        break;
                    case "add":
                    case "a":
                    case "insert":
                    case "i":
                        let arg = message.content.substring(words[0].length + words[1].length + words[2].length + 3);
                        config.fakeStarts[words[2]].push(arg);
                        message.reply(`Successfully added a fake message start \`${arg}\``);
                        break;
                    case "remove":
                    case "r":
                    case "delete":
                    case "d":
                        let arg = message.content.substring(words[0].length + words[1].length + words[2].length + 3);
                        let index_to_replace = config.fakeStarts[words[2]].findIndex(t => t == arg);
                        config.fakeStarts[words[2]][index_to_replace] = config.fakeStarts[words[2]][config.fakeStarts[words[2].length - 1]];
                        config.fakeStarts[words[2]].pop();
                        message.reply(`Successfully removed a fake message start \`${arg}\``);
                        break;
                    default:
                        message.reply("Unknown action.");
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
                        let list = "Task list.\n";

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
                        let arg = message.content.substring(words[0].length + words[1].length + words[2].length + words[3].length + 4);
                        switch (arg) {
                            case "say":
                            case "react":
                            case "nickname":
                            case "status":
                                config.tasks[words[3]].push(arg);
                                message.reply(`Successfully added a task \`${words[3]}\` with the argument of \`${arg}\`.`);
                                break;
                            default:
                                message.reply("Unknown task type.");
                        }
                        break;
                    case "remove":
                    case "r":
                    case "delete":
                    case "d":
                        switch (arg) {
                            case "say":
                            case "react":
                            case "nickname":
                            case "status":
                                let arg = message.content.substring(words[0].length + words[1].length + words[2].length + words[3].length + 4);
                                let index_to_replace = config.tasks[words[3]].findIndex(t => t == arg);
                                config.tasks[words[3]][index_to_replace] = config.tasks[words[3]][config.tasks[words[3].length - 1]];
                                config.tasks[words[3]].pop();
                                message.reply(`Successfully removed a task \`${words[3]}\` with the argument of \`${arg}\`.`);
                                break;
                            default:
                                message.reply("Unknown task type.");
                                break;
                        }
                        break;
                    default:
                        message.reply("Unknown action.");
                        break;
                }

                fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(tasks));
                break;
            default:
                message.reply("Unknown action.");
                break;
        }
    }
}
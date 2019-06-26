const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: ['config'],
    type: 'all',
    help: 'Configure the game for your own server.\n\n`config fakeStarts add <text>` adds a fake start of a "Simon says" message. For example, "Simoon says".\n`config fakeStarts remove <text>`\n`config fakeStarts view`\n`config tasks view` to view all settings\n`config tasks add <task type> <task argument>`\n`config tasks remove <task type> <task argument>`\nTask types: `say` (send message), `react` (put a reaction to the task message), `nickname` (set a nickname on the server), `status` (set status, can be online/idle/dnd/offline)\nTask argument is the text required for a task, nickname, status etc.\n\nYou can use `t` as an alias for `tasks`; `f` for `fakeStarts`; `insert`, `i`, `a` for `add`; `delete`, `d`, `r` for `remove`; `list`, `l`, `v` for `view`.',

    execute(client, message, words) {
        var tasks = JSON.parse(fs.readFileSync(`config.json`)).default_settings;
        switch (words[1]) {
            case "fakeStarts":
            case "f":

                break;

            case "tasks":
            case "t":
                fs.open(`./guilds/${message.guild.id}.json`, 'r', (err, fd) => {
                    if (err) fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(tasks))
                    else
                        tasks = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}.json`))
                })

                console.log(tasks)

                switch (words[2]) {
                    case "view":
                    case "v":
                    case "list":
                    case "l":
                        let list = "Task list.\n";

                        list += "\n**say**   "
                        tasks.tasks.say.forEach(t => {
                            list += ` \`${t}\` `;
                        });

                        list += "\n**react**   "
                        tasks.tasks.react.forEach(t => {
                            list += ` \`${t}\` `;
                        });

                        list += "\n**nickname**   "
                        tasks.tasks.nickname.forEach(t => {
                            list += ` \`${t}\` `;
                        });

                        list += "\n**status**   "
                        tasks.tasks.status.forEach(t => {
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
                                tasks.tasks[words[3]].push(arg);
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
                                let index_to_replace = tasks.tasks[words[3]].findIndex(t => t == arg);
                                tasks.tasks[words[3]].index_to_replace = tasks.tasks[words[3]][tasks.tasks[words[3].length - 1]];
                                tasks.tasks[words[3]].pop();
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
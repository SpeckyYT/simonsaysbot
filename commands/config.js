const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    name: ['config'],
    type: 'all',
    help: 'Configure the game for your own server.\n\n__Can be used by everyone.__\n\n`config prefix view`\n\n__Available for people with config editing permissions.__\n\n`config minigames view` see list of minigames for this server\n`config minigames enable/disable <minigame>`\n`config prefix set <prefix>`\n`config fakeStarts add/remove <text>` adds a fake start of a "Simon says" message. For example, "Simoon says".\n`config fakeStarts view`\n`config tasks view`\n`config tasks add/remove <task type> <task argument>`\nTask types: `say`, `react` (put any reaction), `reactSpecific`, `status` (set status of online/idle/dnd/offline), `solveEquation`, `writeDM`, `writeDMSpecific`\n\n__Available for server owner only.__\n\n`config permissions config grant/revoke <user>` manages permissions for all the command above\n`config permissions start grant/revoke <user>` manages permissions to start the game\n\nTask argument is the text required for a task, status etc. Arguments can be shortened to one character (`tasks` -> `t`).',

    execute(client, message, words) {
        var config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}.json`))

        if (config["config_permission"].join(' ').includes(message.author.id)) {
            switch (words[1]) {
                case "permission":
                case "permissions":
                case "perm":
                case "perms":
                    if (message.member == message.guild.owner) {
                        var arg = message.content.substring(words[0].length + words[1].length + words[2].length + words[3].length + 4);
                        if (words[3] != "view" && words[3] != "v" && words[3] != "list" && words[3] != "l") {
                            if (message.mentions.users.array().length == 0)
                                var grantedUser = message.guild.members.find(m => m.user.username.toLowerCase() == arg.toLowerCase()).user
                            else grantedUser = message.mentions.users.first()
                            if (!grantedUser) message.reply(`Can't find that user.`)
                        }
                            switch (words[2]) {
                                case "config":
                                case "c":
                                    switch (words[3]) {
                                        case "grant":
                                        case "g":
                                            config["config_permission"].push(grantedUser.id);
                                            if (config["config_permission"].join(" ").includes(grantedUser.id))
                                                message.reply("That user already has the config permission.")
                                            else {
                                                config["config_permission"].push(grantedUser.id);
                                                fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                                                message.reply(`\`${grantedUser.tag}\` has just been granted permissions to edit server configurations!`);
                                            }
                                            break;
                                        case "revoke":
                                        case "r":
                                            var index_to_replace = config["config_permission"].findIndex(t => t == grantedUser.id);
                                            if (!config["config_permission"].join(" ").includes(grantedUser.id)) message.reply("That user doesn't have the config permission.")
                                            else {
                                                config["config_permission"][index_to_replace] = config["config_permission"][config["config_permission"].length - 1];
                                                config["config_permission"].pop();
                                                fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                                                message.reply(`\`${grantedUser.tag}\` now can't edit server configurations :(`);
                                            }
                                            break;
                                        case "view":
                                        case "v":
                                        case "list":
                                        case "l":
                                            var list = "In this list belongs everyone who has access to your server's config: \n";

                                            config["config_permission"].forEach(t => {
                                                list += ` \`${message.guild.members.find(m => m.user.id == t).user.tag}\` `;
                                            });

                                            message.channel.send(list)
                                            break;
                                        default:
                                            message.reply(`Unknown action. Type \`${config.prefix}help config\` for more info.`);
                                            break;
                                    }
                                    break;
                                case "start":
                                case "s":
                                    switch (words[3]) {
                                        case "grant":
                                        case "g":
                                            if (config["start_permission"].join(" ").includes(grantedUser.id))
                                                message.reply("That user already has the start permission.")
                                            else {
                                                config["start_permission"].push(grantedUser.id);
                                                fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                                                message.reply(`\`${grantedUser.tag}\` has just been granted permissions to start the game!`);
                                            }
                                            break;
                                        case "revoke":
                                        case "r":
                                            var index_to_replace = config["start_permission"].findIndex(t => t == grantedUser.id);
                                            if (!config["start_permission"].join(" ").includes(grantedUser.id)) message.reply("That user doesn't have the start permission.")
                                            else {
                                                config["start_permission"][index_to_replace] = config["start_permission"][config["start_permission"].length - 1];
                                                config["start_permission"].pop();
                                                fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config));
                                                message.reply(`\`${grantedUser.tag}\` now can't start a game :(`);
                                            }
                                            break;
                                        case "view":
                                        case "v":
                                        case "list":
                                        case "l":
                                            var list = "In this list belongs everyone who has access to start the game: \n";

                                            config["start_permission"].forEach(t => {
                                                list += ` \`${message.guild.members.find(m => m.user.id == t).user.tag}\` `;
                                            });

                                            list += "\nMore people -> more fun! :D"

                                            message.channel.send(list)
                                            break;
                                        default:
                                            message.reply(`Unknown action. Type \`${config.prefix}help config\` for more info.`);
                                            break;
                                    }
                                    break;
                            }
                    }
                    else
                        message.reply("Only the server's owner can run this command!")
                    break;
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
                    if (message.member == message.guild.owner) {
                        switch (words[2]) {
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
                    }
                    else
                        message.reply("Only the server's owner can run this command!")
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
        else if (words[1] == "prefix" && words[2] == "view") message.channel.send(`The current prefix for the server "${message.guild.name}" is \`${config.prefix}\``)
        else message.reply("You do not have permissions to use this command!");
    }
}

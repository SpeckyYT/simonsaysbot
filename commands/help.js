
const {
    RichEmbed
} = require('discord.js');

module.exports = {
    name: ['help', 'h'],
    type: 'all',
    help: 'this',
    execute(client, message, words) {
        if (words.length < 2) {
            const embed = new RichEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL, "https://github.com/Mantevian/simonsaysbot")
            .setColor(message.member.displayColor)
            .setDescription("This bot is a recreation of a popular game 'Simon says', made for the official Discord event called 'Hack Week'.\n\nThis is a text game where people should do what Simon says, meaning they should not do anything if Simon didn't say that. There is an 'Opposite day' event though, during which players should listen to everyone else except Simon. If someone doesn't listen, they fall out of the game. The last person staying in the game wins. Good luck!\n\nCommands:\n`start <#channel>` starts the game in specific channel\n`config` provides server owner a plenty of customizable options for the game")
            .setFooter("Made by Manteex#6804 & SputNix#6119")
            message.channel.send(embed)
            return
        }
        if (client.commands.get(words[1])) {
            let cmd = client.commands.get(words[1])
            const embed = new RichEmbed().setTitle('**COMMAND HELP**').addField('Aliases:', cmd.name.join(', ')).addField('Type:', cmd.type).addField('Description:', cmd.help)
                .setColor(message.member.displayColor)
            message.channel.send(embed)
            return
        }
        message.channel.send('No command with name: ' + words[1])
    }
}
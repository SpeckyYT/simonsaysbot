
const {
    RichEmbed
} = require('discord.js');

module.exports = {
    name: ['help', 'h'],
    type: 'all',
    help: 'this',
    execute(client, message, words) {
        if(words.length < 2){
            message.channel.send('Include command name')
            return
        }
        if (client.commands.get(words[1])) {
            let cmd = client.commands.get(words[1])
            const embed = new RichEmbed().setTitle('**COMMAND HELP**').addField('Aliases:', cmd.name.join(', ')).addField('Type:', cmd.type).addField('Description:', cmd.help)
            message.channel.send(embed)
            return
        }
        message.channel.send('No command with name: ' + words[1])
    }
}
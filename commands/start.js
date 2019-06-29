const discord = require('discord.js')
const fs = require('fs')

const {
    Client,
    RichEmbed
} = discord;

const { runGame } = require('../game.js');

module.exports = {
    name: ['start', 'startgame', 'game', 'newgame', 'new'],
    type: 'all',
    help: 'startgame [channel] ([joinTime])',

    execute(client, message, words) {
        var config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}.json`))
        config.opposite_day = false
        fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config))
        if (!config["start_permission"].join(" ").includes(message.author.id)) {
            message.reply(`You don't have permissions to use this command!`)
            return
        }
        if (words.length < 2) {
            message.reply(`Include a channel! (${words[0]} #[channelname])`)
            return
        }

        let channel = client.channels.get(words[1].slice(2).slice(0, -1))

        if (!channel) {
            message.reply(`That's not a valid channel!`)
            return
        }
        let time = words[2] ? parseInt(words[2]) * 1000 : 60000
        if (!time){
            message.reply('The time must be an integer of seconds.')
            return
        }

        if (channel) {
            message.channel.send(`Starting game in ${channel}!`)
        } else {
            message.reply(`${words[1]} is not a valid channel`)
            return
        }

        //collect players

        let startembed = new RichEmbed().setTitle("REACT TO THIS MESSAGE TO JOIN SIMON SAYS!")
        .setDescription(`Hosted by <@${message.author.id}>`)
        .setColor(message.member.displayColor)
        .setFooter(`The game will start in ${Math.floor(time / 1000)} seconds.`)
        channel.send(startembed).then(async (msg) => {
            msg.react('🎲')
            
            let collected = await msg.awaitReactions(() => true, {
                time: time
            })

            if(collected.size < 2){
                channel.send('**Game canceled!** Not enough players!')
                return
            }
            
            let players = []
            for (let reaction of collected.array()) {
                let users = await reaction.fetchUsers()
                players = players.concat(users.array())
            }
            players = players.filter(player => player.id != client.user.id)

            channel.send(`The game is starting! Players: ${players.join(', ')}`)
            let explanationEmbed = new RichEmbed().setTitle('**Only follow my commands if it starts with "Simon says". \n If you fail, you are out of the game!**')
                                                  .setColor('#77ecf2')
            channel.send(explanationEmbed)
            if(time > 30000 || players.length > 5){
                await sleep(10000)
            } else {
                await sleep(5000)
            }

            runGame(channel, players, client)
            msg.delete()
            //make game mechanics in game.js
        })
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

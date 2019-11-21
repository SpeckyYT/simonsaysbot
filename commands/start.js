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
        
        /*if (words.length < 2) {
            message.reply(`Include a channel! (${words[0]} #[channelname])`)
            return
        }*/

        let channel = message.mentions.channels.first()

        var time;
    
        if (!channel) {
            channel = message.channel;
            time = words[1] ? parseInt(args[1], 10) * 1000 : 60000
        } else {
            time = args[2] ? parseInt(args[2], 10) * 1000 : 60000
            if(!time){
                time = args[1] ? parseInt(args[1], 10) * 1000 : 60000
            }
        }
    
        if (!time){
            message.reply('the time must be an integer of seconds.')
            return
        }
    
        if (channel != message.channel) {
            message.channel.send(`Starting game in ${channel}!`)
        }

        //collect players

        let startembed = new RichEmbed().setTitle("REACT TO THIS MESSAGE WITH 🎲 TO JOIN SIMON SAYS!")
        .setDescription(`Hosted by <@${message.author.id}>`)
        .setColor(message.member.displayColor)
        .setFooter(`The game will start in ${Math.floor(time / 1000)} seconds.`)
        channel.send(startembed).then(async (msg) => {
            msg.react('🎲')
            
            let collected = await msg.awaitReactions(() => true, {
                time: time
            })

            /*if(collected.size < 2){
                channel.send('**Game canceled!** Not enough players!')
                return
            }*/
            
            let players = []
            for (let reaction of collected.array()) {
                if(reaction.emoji.name == '🎲'){
                    let users = await reaction.fetchUsers()
                    players = players.concat(users.array())
                }
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

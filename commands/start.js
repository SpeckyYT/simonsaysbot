const discord = require('discord.js')

const {
    Client,
    RichEmbed
} = discord;

const {runGame} = require('../game.js');

module.exports = {
    name: ['start', 'startgame', 'game', 'newgame', 'new'],
    type: 'all',
    help: '=startgame [channel]',

    execute(client, message, words) {

        let channel = client.channels.get(words[1].slice(2).slice(0, -1))

        if (channel) {
            message.channel.send(`starting game in ${channel}!`)
        } else {
            message.channel.send(`${words[1]} is not a valid channel`)
            return
        }

        //collect players

        let startembed = new RichEmbed().setTitle("REACT TO THIS MESSAGE TO JOIN SIMON SAYS!")
        channel.send(startembed).then(async (msg) => {
            msg.react('🎲')

            let collected = await msg.awaitReactions(() => true, {
                time: 10000
            })

            msg.delete()
            /*if(collected.size < 2){
                channel.send('**Game canceled!** Not enough players!')
                return
            }*/ //add this back in final release
            channel.send(`**Starting game with ${collected.size} players!**`)
            let players = []
            for(let reaction of collected.array()){
                let users = await reaction.fetchUsers()
                players = players.concat(users.array())
            }
            players = players.filter(player => player.id != client.user.id)

            runGame(channel, players, client)
            //make game mechanics in game.js
        })



    }
}
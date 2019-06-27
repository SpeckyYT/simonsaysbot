let randomStart = require('./randomStart.js')
var discord = require('discord.js')

module.exports.runGame = async function (channel, players_, client) {
    let players = players_
    let time = 15000
    let winners
    let gameOn = true
    let rounds = 1
    //example of how to start a game
    while (gameOn) {
        //chooses a random minigame
        const currentGame = client.minigames[getRandomInt(client.minigames.length)]
        //picks a random start of startmessage (50% chance of getting "Simon says")
        const start = randomStart(channel.guild.id)
        
        //sends startmessage
        const startMessage = await channel.send(`${start.string} ${currentGame.startMessage.toLowerCase()}`)
        //runs the game
        
        let {
            playersOut,
            playersLeft
        } = await currentGame.run(channel, players, time, client, {
            simonSaid: start.real,
            startMessage: startMessage
        })
        
        await sleep(1000)

        //say whos out
        let embed = new discord.RichEmbed()
        if (playersOut.length > 0) embed.setDescription(`${playersOut.join(', ')} ${playersOut.length > 1 ? "are" : "is"} out!`)
        else embed.setTitle('Good job! Nobody fell out!')

        channel.send(embed)

        await sleep(1000)
        
        if(playersLeft.length < 1){
            winners = playersOut
            gameOn = false
            break
        }
        time *= 0.9
        players = playersLeft
        rounds++
    }

    channel.send(`${winners.join(', ')} won with ${rounds} points! GG`)

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
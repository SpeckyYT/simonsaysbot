let randomStart = require('./randomStart.js')
var discord = require('discord.js')

module.exports.runGame = async function (channel, players, client) {

    //example of how to start a game

    //chooses a random minigame
    const currentGame = client.minigames[getRandomInt(client.minigames.length)]
    //picks a random start of startmessage (50% chance of getting "Simon says")
    const start = randomStart(channel.guild.id)
    //sends startmessage
    const startMessage = await channel.send(`${start.string} ${currentGame.startMessage.toLowerCase()}`)
    //runs the game
    const time = 15000 //how much time each player has to complete the task, should lower over time
    let {playersOut, playersLeft} = await currentGame.run(channel, players, time, client, {
        simonSaid: start.real,
        startMessage: startMessage
    })
    //say whos out
    if(playersOut.length > 0) channel.send(`${playersOut.join(', ')} ${playersOut.length > 1 ? "are" : "is"} out!`)
    //console log whos still in the game (for testing)
    console.log(playersLeft.map((player) => player.username))
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
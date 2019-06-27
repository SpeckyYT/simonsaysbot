let randomStart = require('./randomStart.js')
var discord = require('discord.js')
var fs = require('fs')

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
        //picks a random start of startmessage (67% chance of getting "Simon says")
        let start
        if(currentGame.startMessage == 'it\'s a new day!'){
            start = {
                string: 'Simon says',
                real: true
            }
        } else {
            start = randomStart(channel.guild.id)
        }

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
        var embed = new discord.RichEmbed()
        if (playersOut.length > 0) {
            embed.setDescription(`${playersOut.join(', ')} ${playersOut.length > 1 ? "are" : "is"} out!`)
                .setColor(`#FF230F`)
        }
        else {
            embed.setTitle('Good job! Nobody fell out!')
                .setColor(`#33CC14`)
        }

        channel.send(embed)

        await sleep(1000)

        if (playersLeft.length < 1) {
            winners = playersOut
            gameOn = false
            break
        }
        time *= 0.9
        players = playersLeft
        rounds++
    }

    var embed = new discord.RichEmbed()
    .setTitle('The game has ended!')
    .setDescription(`${winners.join(', ')} won with ${rounds} points! GG!`)
    .setColor('#FFBE11')
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
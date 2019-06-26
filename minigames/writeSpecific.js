const fs = require('fs')
module.exports = {
    startMessage: 'write this in chat:',
    run: async function (channel, players, time, client, info) {
        const alternatives = JSON.parse(fs.readFileSync(`./guilds/${channel.guild.id}.json`)).tasks.say

        const word = alternatives[getRandomInt(alternatives.length)].toLowerCase()
        await channel.send(`**${word.toUpperCase()}**`)

        const collector = channel.createMessageCollector(() => true, {
            time: time
        });

        //when time is up
        
        let collected = await new Promise(resolve => {
            collector.on('end', collected_ => {
                resolve(collected_)
            });
        })

        await channel.send('Simon says time\'s up!')
        let messages = collected.array()
        let out = []
        let outIndex = []
        //check each player to see if they are out
        players.forEach((player, i) => {
            //check each message
            let sentCorrectMessage = false
            for (const message of messages) {
                if (message.author == player && message.content.toLowerCase().includes(word)) {
                    //if simon didnt say, the player is out
                    if (!info.simonSaid) {
                        out.push(player)
                        outIndex.push(i)
                    } else {
                        sentCorrectMessage = true
                    }
                    break
                }
            }
            if (info.simonSaid && !sentCorrectMessage) {
                out.push(player)
                outIndex.push(i)
            }
        })
        outIndex.sort((a, b) => b - a);
        let newPlayers = players
        outIndex.forEach((i) => {
            newPlayers.splice(i)
        })
        return({
            playersOut: out,
            playersLeft: newPlayers
        })
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
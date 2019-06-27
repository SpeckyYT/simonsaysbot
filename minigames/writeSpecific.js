var fs = require('fs');

module.exports = {
    startMessage: 'write this in chat:',
    run: async function (channel, players, time, client, info) {
        const config = JSON.parse(fs.readFileSync(`./guilds/${channel.guild.id}.json`))
        const alternatives = config.tasks.say

        const word = alternatives[getRandomInt(alternatives.length)].toLowerCase()
        await channel.send(`**${word}**`)

        const collector = channel.createMessageCollector(() => true);

        let collected
        collector.on('end', collected_ => {
            collected = collected_
        });

        //when time is up
        await sleep(time)
        if (config.opposite_day) await channel.send('Alright time\'s up!')
        else await channel.send('Simon says time\'s up!')
        collector.stop()

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
        return ({
            playersOut: out,
            playersLeft: newPlayers
        })
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
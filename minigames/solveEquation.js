const fs = require('fs')
module.exports = {
    startMessage: 'write the correct answer to this equation:',
    run: async function (channel, players, time, client, info) {
        const symbols = ['+', '-', '*'] //×
        const symbol = symbols[getRandomInt(symbols.length)]
        const equation = `${getRandomInt(symbol == '*' ? 10 : 20)} ${symbol} ${getRandomInt(symbol == '*' ? 10 : 20)}`
        await channel.send(`**${equation.toUpperCase().replace('*', '×')}**`)
        const answer = eval(equation)

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
                if (message.author == player && message.content.toLowerCase().includes(answer)) {
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
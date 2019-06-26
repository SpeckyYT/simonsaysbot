module.exports = {
    startMessage: 'don\'t write anything in chat!',
    run: async function (channel, players, time, client, info) {
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
            let sentMessage = false
            for (const message of messages) {
                if (message.author == player) {
                    //if simon didnt say, the player is out
                    if (info.simonSaid) {
                        out.push(player)
                        outIndex.push(i)
                    }
                    break
                }
            }
            if (info.simonSaid && !sentMessage) {
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
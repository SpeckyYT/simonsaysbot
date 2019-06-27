const fs = require('fs')
module.exports = {
    startMessage: 'it\'s a new day!',
    run: async function (channel, players, time, client, info) {
        var config = JSON.parse(fs.readFileSync(`./guilds/${channel.guild.id}.json`))
        
        if (!config.opposite_day) await channel.send('Opposite day begins soon! Write **ok** in chat if you are ready!')
        else await channel.send('Opposite day has ended! Write **ok** if you are ready to go back to normal!')

        const collector = channel.createMessageCollector(() => true);

        let collected
        collector.on('end', collected_ => {
            collected = collected_
        });

        //when time is up
        await sleep(time)

        if (!config.opposite_day) await channel.send('Simon says time\'s up! We\'re ready to start the opposite day!')
        else await channel.send('Alright time\'s up! We\'ve ended the opposite day!')

        collector.stop()

        let messages = collected.array()
        let out = []
        let outIndex = []
        //check each player to see if they are out
        players.forEach((player, i) => {
            //check each message
            let sentCorrectMessage = false
            for (const message of messages) {
                if (message.author == player && message.content.toLowerCase().includes("ok")) {
                    sentCorrectMessage = true
                    break
                }
            }
            if (!sentCorrectMessage) {
                out.push(player)
                outIndex.push(i)
            }
        })
        outIndex.sort((a, b) => b - a);
        let newPlayers = players
        outIndex.forEach((i) => {
            newPlayers.splice(i)
        })

        config.opposite_day = !config.opposite_day
        fs.writeFileSync(`./guilds/${channel.guild.id}.json`, JSON.stringify(config))

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
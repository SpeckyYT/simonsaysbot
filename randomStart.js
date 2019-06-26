var fs = require('fs');

module.exports = function (guild_id) {
    const config = fs.readFileSync(`./guilds/${guild_id}.json`);
    let choice = getRandomInt(4)
    
    if (choice != 0) {
        return ({
            string: 'Simon says',
            real: true
        })
    }

    return ({
        string: config.fakeStarts[getRandomInt(config.fakeStarts.length)],
        real: false
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
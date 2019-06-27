var fs = require('fs');

module.exports = function (guild_id) {
    const config = JSON.parse(fs.readFileSync(`./guilds/${guild_id}.json`));
    let choice = getRandomInt(3)

    if (choice != 0) {
        return ({
            string: 'Simon says',
            real: config.opposite_day ? false : true
        })
    }

    return ({
        string: config.fakeStarts[getRandomInt(config.fakeStarts.length)],
        real: config.opposite_day ? true : false
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
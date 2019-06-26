const fakeStarts = [
    'Ok,',
    'Now,',
    'Simone says'
]


module.exports = function () {

    let choice = getRandomInt(2)
    
    if (choice == 0) {
        return ({
            string: 'Simon says',
            real: true
        })
    }

    return ({
        string: fakeStarts[getRandomInt(fakeStarts.length)],
        real: false
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
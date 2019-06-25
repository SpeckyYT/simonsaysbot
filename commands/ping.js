module.exports = {
    name: ['ping'],
    type: 'all',
    help: 'description here',
    
    execute(client, message, words) {
        message.channel.send("pong!")
    }
}
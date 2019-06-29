const discord = require('discord.js')
const fs = require('fs')

const {
    Client,
    RichEmbed
} = discord;

const client = new Client();

const config = JSON.parse(fs.readFileSync('config.json'));

//command stuff
client.commands = new discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    for (const n of command.name) {
        client.commands.set(n, command)
    }
}

console.log(`Loaded ${commandFiles.length} commands and ${client.commands.array().length} aliases!`);

client.on('message', message => {
    // if config creation failed, we can still make it here
    if(message.channel.type == 'dm') return
    var guildConfig = config.default_settings
    
    fs.open(`./guilds/${message.guild.id}.json`, 'r', (err, fd) => {
        if (err) {
            fs.writeFileSync(`./guilds/${message.guild.id}.json`, JSON.stringify(config.default_settings))
            guildConfig = config.default_settings;
            guildConfig["config_permission"].push(message.guild.ownerID)
            guildConfig["start_permission"].push(message.guild.ownerID)
        }
        
        else guildConfig = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}.json`))
        

        const prefix = guildConfig.prefix
        let content = message.content
        if (!content.startsWith(prefix) && !content.includes(`<@${client.user.id}>`)) return
        let words = content.split(' ')

        let cmd = client.commands.get(words[0].slice(prefix.length))

        if (cmd) {
            console.log(message.author.username + " (" + message.channel.type + ") " + ": " + message.content)
            try {
            cmd.execute(client, message, words)
            } catch (error) {
                message.channel.send("**ERROR: **" + error).then(msg => msg.delete(10000))
                console.log("**ERROR: **" + error)
            }
        }
    })
})

client.on('ready', () => {
    console.log('online!')
})

// make config file when joined new guild
client.on('guildCreate', guild => {
    var guildConfig = config.default_settings
    
    fs.open(`./guilds/${guild.id}.json`, 'r', (err, fd) => {
        if (err) {
            fs.writeFileSync(`./guilds/${guild.id}.json`, JSON.stringify(config.default_settings))
        }
        else guildConfig = JSON.parse(fs.readFileSync(`./guilds/${guild.id}.json`))
    })
    
    guildConfig.config_permission.push(guild.ownerID)
    guildConfig.start_permission.push(guild.ownerID)
    fs.writeFileSync(`./guilds/${guild.id}.json`, JSON.stringify(guildConfig))
})

//loading minigames
client.minigames = []
const gameFiles = fs.readdirSync('./minigames').filter(file => file.endsWith('.js'))

for (const file of gameFiles) {
    const game = require(`./minigames/${file}`)
    client.minigames.push(game)
}

console.log(`Loaded ${client.minigames.length} games!`)

client.on('error', console.error);
client.login(config.token)

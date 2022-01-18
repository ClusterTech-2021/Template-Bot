// Discord Modules:
const {Collection, Client, Discord, MessageEmbed, MessageReaction } = require('discord.js')
const fs = require('fs')
const request = require('request');


// Client
const client = new Client({
    disableEveryone: true,
    partials: ["MESSAGE", "CHANNEL", "REACTION" ],
    intents: ["GUILD_VOICE_STATES"],
  });


// Misc:
const config = require('./config/config.json')
const prefix = config.prefix
const token = config.token

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 

// Bio
client.on('ready', () => {
    client.user.setStatus("dnd")
    client.user.setActivity(`${prefix}help`)
    console.log(`${client.user.username} Is Online, and Running Smoothly.`)
})

// Variables for index.js Messages
const talkedRecently = new Set();

// Index.js Messages
client.on('message', async message =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) command.run(client, message, args) 
})

client.login(token)

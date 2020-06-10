const Discord = require('discord.js');
const fetch = require('node-fetch');
const { unicorn } = require('./services/unicorn');
const { youTube } = require('./services/youtube');
const { valorant } = require('./services/valorant'); // todo wip
const { scrim } = require('./test'); //todo wip
const {
    PREFIX,
    DISCORD_TOKEN,
} = require('./config');
const { db } = require('./db.js');

const client = new Discord.Client();

client.login(DISCORD_TOKEN);

client.once('ready', () => {
    db.connect();
    console.log("Unicorn trotting!")
});

// UNICORN - !uni
client.on('message', message => {
    try {
        if (message.content.startsWith(`${PREFIX}uni`)) unicorn(message);
        else if (message.content === 'ping') message.reply('pong');
        else if (message.content === '!flip' || message.content === '!f') message.reply(Math.round(Math.random()) === 1 ? ' ♕ Heads!' : ' ♘ Tails!');
        else if (message.content.startsWith('!scrim')) scrim(message)
    } catch (err) {
        console.log(err.stack)
        message.reply('Hiccup...');
    }
});

// YOUTUBE - !yt
client.on('message', async msg => {
    if (msg.content.startsWith(`${PREFIX}yt`)) {
        const content = msg.content;
        const vidName = content.indexOf('!yt') + 1;
        const result = content.substring(vidName + 1);
        msg.channel.send(await youTube(result));
    }
});

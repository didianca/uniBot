const Discord = require('discord.js');
const fetch = require('node-fetch');
const { unicorn } = require('./services/unicorn');
const { youTube } = require('./services/youtube');
const { Valorant } = require('./services/valorant');
const sqllite = require('./sqllite.js');
const {
    PREFIX,
    DISCORD_TOKEN,
} = require('./config');

const client = new Discord.Client();

client.login(DISCORD_TOKEN);
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    sqllite.init();
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

const scrim = async (message) => {
    const CHANNEL_CHEESE_CAKE = '310195830290382848';
    const channel = await client.channels.fetch(CHANNEL_CHEESE_CAKE);
    const usersInChannel = [];
    const memberIds = [];
    //console.log(channel.members);
    for (let [sf, member] of channel.members) {
        // console.log(member);
        console.log(member.id);
        const name = member.nickname ? member.nickname : member.user.username;
        usersInChannel.push(name);
        memberIds.push(member.id);
        sqllite.insertPlayerIfNotExists(member.id, name);
    }
    const allUsers = shuffle(usersInChannel);
    if (allUsers.length < 2) {
        message.channel.send('Players must be in Cheese Cake Channel');
        return;
    }
    let teamMessage = `> Team ${allUsers[0]}:\n`;
    console.log(allUsers);
    for (let i = 0; i < allUsers.length; i++) {
        if (i === Math.floor(allUsers.length / 2)) teamMessage += `\n> Team ${allUsers[i]}:\n`;
        teamMessage += `${allUsers[i]}\n`;
    }
    message.channel.send(teamMessage);
};

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


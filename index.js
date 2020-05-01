const Discord = require('discord.js');
const {Uni} = require('./uniBot');
const {prefix, token, giphyToken, ytToken} = require('./config');
const client = new Discord.Client();

const GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);
const fetch = require('node-fetch');


client.once('ready', () => {
    console.log("Unicorn trotting!")
});

//!uni
client.on('message', message => {
    try {
        if (message.content.startsWith(`${prefix}uni`)) Uni(message);
        else if (message.content === 'ping') message.reply('pong');
        else if (message.content === '!flip' || message.content === '!f') message.reply(Math.round(Math.random()) === 1 ? ' ♕ Heads!' : ' ♘ Tails!');
        else if (message.content.startsWith('!scrim')) scrim(message)
    } catch {
        //message.reply('Something broke, should have written tests.');
    }
});

const scrim = async (message) => {
    const CHANNEL_CHEESE_CAKE = '310195830290382848';
    const channel = await client.channels.fetch(CHANNEL_CHEESE_CAKE);
    const usersInChannel = [];
    //console.log(channel.members);
    for (let [sf, member] of channel.members) {
        console.log(member);
        const name = member.nickname ? member.nickname : member.user.username;
        usersInChannel.push(name);
    }
    const allUsers = shuffle(usersInChannel);

    let teamMessage = `> Team ${allUsers[0]}:\n`;
    const half = allUsers.length / 2;
    console.log(allUsers);
    for (let i = 0; i < allUsers.length; i++) {
        if (i === half) teamMessage += `\n> Team ${allUsers[i]}:\n`;
        teamMessage += `${allUsers[i]}\n`;
    }
    message.channel.send(teamMessage)
};

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

//send youtube videos
client.on('message', async msg => {
    if (msg.content.startsWith(`${prefix}yt`)) {
        const content = msg.content;
        const vidName = content.indexOf('!yt') + 1;
        const result = content.substring(vidName + 1);
        msg.channel.send(await getVidLink(result));
    }
});

const getVidLink = async (vidName) => {
    try {
        const encodedVidName = encodeURI(vidName);
        console.log(encodedVidName);
        const params = {url: `https://www.googleapis.com/youtube/v3/search?part=id&maxResults=2&order=viewCount&type=video&key=${ytToken}&q=${encodedVidName}`};
        const response = await request('GET', params);
        const videoId = response.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (e) {
        return "This video doesn't exist..."
    }
};

const request = async (verb, params) => {
    let res;
    res = verb.toUpperCase() === 'GET' ?
        await fetch(
            params.url, {
                method: verb,
                headers: params.headers
            }) :
        await fetch(
            params.url, {
                method: verb,
                body: params.body,
                headers: params.headers
            });
    return await res.json();
};

client.login(token);



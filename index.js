const Discord = require('discord.js');
const {prefix, token, giphyToken, ytToken} = require('./config');
const client = new Discord.Client();
const quotes = require('./quotes');
const GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);
const fetch = require('node-fetch');

client.once('ready', () => {console.log("Unicorn trotting!")});

//!uni
client.on('message', message => {
    if (message.content.startsWith(`${prefix}uni`)) {
        let member = message.mentions.members.first() || "";
        giphy.search('gifs', {"q": ["magical", "unicorn", "animated candies", "fairyland"]})
            .then((response) => {
                //getting one gif
                let totalResponses = response.data.length;
                let responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
                let finalResponse = response.data[responseIndex];
                //getting one quote
                let totalQuotes = quotes.length;
                let quotesIndex = Math.floor((Math.random() * 10) + 1) % totalQuotes;
                let quote = quotes[quotesIndex];

                message.channel.send(`${quote} ${member} :unicorn:`, {
                    files: [finalResponse.images.fixed_height.url]
                });
            })
            .catch(() => {
                message.channel.send('Hiccup...')
            });
    }
});

//ping-pong
client.on('message', msg => {
    if (msg.content === 'ping') msg.reply('pong');
});

//coin flip
client.on('message', msg => {
    if (msg.content.includes('!flip')){
        const coinSide = Math.round(Math.random()) === 1 ? ' ♕ Heads!' : ' ♘ Tails!';
        msg.reply(coinSide);
    }
});

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



const Discord = require('discord.js');
const{prefix,token, giphyToken} = require('./config');
const client = new Discord.Client();
const quotes =require('./quotes');
const GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);

client.once('ready',()=>{
    console.log("Ready!")
});
client.on('message',message => {
    if(message.content.startsWith(`${prefix}uni`)){
        let member = message.mentions.members.first() || "";
        giphy.search('gifs',{"q":["magical","unicorn","animated candies","fairyland"]})
            .then((response)=>{
                //getting one gif
                let totalResponses = response.data.length;
                let responseIndex=Math.floor((Math.random() *10)+1) % totalResponses;
                let finalResponse = response.data[responseIndex];

                //getting one quote
                let totalQuotes = quotes.length;
                let quotesIndex = Math.floor((Math.random() *10)+1) % totalQuotes;
                let quote = quotes[quotesIndex];
                message.channel.send(`${quote} ${member} :unicorn:`,{
                    files:[finalResponse.images.fixed_height.url]
                });
            })
            .catch((e)=>{
                message.channel.send('Nasty error')
        });

    }
});


client.login(token);



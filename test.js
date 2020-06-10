const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.scrim = async (message) => {
    const textChannelId = message.channel.id;
    const channelId = message.member.voice.channel.id;
    const allChannels = message.guild.channels;
    const author = message.author;
    // console.log(allChannels)
    console.log(channelId)
    // moo id 326014448185769986
};

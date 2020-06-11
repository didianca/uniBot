const Discord = require('discord.js');
const fetch = require('node-fetch');
const {
    getPlayerById,
    updatePlayerInGameName,
    insertPlayerIfNotExists
} = require('../db');
const { db } = require('../db');

const setInGameName = async (playerId, name) => {
    return await updatePlayerInGameName(playerId, name);
}

const scrim = async (message) => {
    if(!message.member.voice.channel.id) return;
    const voiceChannelId = message.member.voice.channel.id;
    const channel = await client.channels.fetch(voiceChannelId);
    const usersInChannel = [];
    const memberIds = [];
    for (let [discordUserId, member] of channel.members) {
        const name = member.nickname ? member.nickname : member.user.username;
        usersInChannel.push(name);
        memberIds.push(member.id);
        db.insertPlayerIfNotExists(member.id, name); // todo: wip
    }
    const allUsers = shuffle(usersInChannel);
    if (allUsers.length < 2) {
        message.channel.send('Players must be in Cheese Cake Channel');
        return;
    }
    let teamMessage = `> Team ${allUsers[0]}:\n`;
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

module.exports = {
    setInGameName,
}

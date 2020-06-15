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

let shuffleCounter = 0;

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
        await insertPlayerIfNotExists(member.id, name);
    }
    if (usersInChannel.length < 2) {
        message.channel.send('At least two players should be connected to a voice channel within this channel.');
        return;
    }
    const playersData = await db.getPlayers(memberIds);
    const shuffledPlayers = shuffle(playersData);
    const teams = splitTeams(shuffledPlayers);
    const disparityArr = await determineDisparity(teams);
    const disparityDifference = disparityArr[0] - disparityArr[1];
    let teamMessage = '';
    if (Math.abs(disparityDifference) >= disparityDifferenceThreshold) {
        if (shuffleCounter % 1 === 0) {
            console.log('unable to balance threshold incremented to:', disparityDifferenceThreshold += 0.5);
            return scrim(message, disparityDifferenceThreshold += 0.5);
        }
        return scrim(message, disparityDifferenceThreshold);
    }
    await db.deleteInProgressMatch(); //there can only be 1 in progress match
    await db.addInProgressMatch(teams);
    teams.forEach(team => {
        teamMessage += `\n> Team ${team[0].name}:\n`;
        team.forEach(user => {
            teamMessage += `${user.name}\n`;
        });
    });
    teamMessage += `\n first team favored by ${disparityDifference}. Threshold: ${disparityDifferenceThreshold}`;
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

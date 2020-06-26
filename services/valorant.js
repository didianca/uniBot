const Discord = require('discord.js');
const fetch = require('node-fetch');
const {
    getPlayerById,
    updatePlayerInGameName,
    insertPlayer,
    getAllPlayers,
    updatePlayerName,
    getPlayersInVoiceChannel,
} = require('../db');
const {
    shuffle,
    splitTeams,
    totalTeamElo,
    determineDisparity,
} = require('../utils/scrim-utils');
const { db } = require('../db');

const setInGameName = async (playerId, name) => {
    return await updatePlayerInGameName(playerId, name);
}

let shuffleCounter = 0;

const scrim = async (message, disparityDifferenceThreshold = 1) => {
    if(!message.member.voice.channel) {
        message.reply('You must be connected to a voice channel in order to scrim.')
        return
    }
    const voiceChannelId = message.member.voice.channel.id;
    const channel = await message.client.channels.fetch(voiceChannelId);

    const usersInChannel = [];
    const memberIds = [];
    for (let [snowflake, member] of channel.members) {
        const name = member.nickname ? member.nickname : member.user.username;
        usersInChannel.push(name);
        memberIds.push(member.id);
        const playerExists = await  getPlayerById(member.id)
        if (!playerExists)  await insertPlayer(member.id, name);
        if(playerExists && playerExists.name !== name) await updatePlayerName(member.id, name);
    }
    if (usersInChannel.length < 2) {
        message.channel.send('At least two players should be connected to a voice channel within this guild.');
        return;
    }

    const playersData = await getPlayersInVoiceChannel(memberIds);
    const shuffledPlayers = shuffle(playersData);
    const teams = splitTeams(shuffledPlayers);
    const disparity = await determineDisparity(teams);
    let teamMessage = '';
    if (Math.abs(disparity) >= disparityDifferenceThreshold) {
        if (shuffleCounter % 1 === 0) {
            message.reply('unable to balance threshold incremented to:', disparityDifferenceThreshold += 0.5);
            return scrim(message, disparityDifferenceThreshold += 0.5);
        }
        return scrim(message, disparityDifferenceThreshold);
    }
    teams.forEach(team => {
        teamMessage += `\n> Team ${team[0].name}:\n`;
        team.forEach(user => {
            teamMessage += `${user.name}\n`;
        });
    });

    teamMessage += `\n First team favored by ${disparity}. Threshold: ${disparityDifferenceThreshold}`;
    message.channel.send(teamMessage);
};

module.exports = {
    setInGameName,
    scrim,
}

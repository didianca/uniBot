const Discord = require('discord.js');
const fetch = require('node-fetch');
const {
    getPlayerById,
    updatePlayerInGameName,
    insertPlayer,
    getAllPlayers,
    updatePlayerName,
    getAverageScoreFromMatches,
    getPlayersInVoiceChannel,
} = require('../db');
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
        console.log(name, '>>>>>>>>>>>>>>>>>>>>>>>>> playerExists: ', playerExists)
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
    const disparityArr = await determineDisparity(teams);
    const disparityDifference = disparityArr[0] - disparityArr[1];
    let teamMessage = '';
    if (Math.abs(disparityDifference) >= disparityDifferenceThreshold) {
        if (shuffleCounter % 1 === 0) {
            message.reply('unable to balance threshold incremented to:', disparityDifferenceThreshold += 0.5);
            return scrim(message, disparityDifferenceThreshold += 0.5);
        }
        return scrim(message, disparityDifferenceThreshold);
    }
    // await db.deleteInProgressMatch(); //there can only be 1 in progress match
    // await db.addInProgressMatch(teams);
    teams.forEach(team => {
        teamMessage += `\n> Team ${team[0].name}:\n`;
        team.forEach(user => {
            teamMessage += `${user.name}\n`;
        });
    });
    teamMessage += `\n First team favored by ${disparityDifference}. Threshold: ${disparityDifferenceThreshold}`;
    message.channel.send(teamMessage);
};

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const splitTeams = (players) => {
    let split = false;
    const firstTeam = [];
    const secondTeam = [];
    for (let i = 0; i < players.length; i++) {
        if (i === Math.floor(players.length / 2)) split = true;
        if (split) firstTeam.push(players[i]);
        else secondTeam.push(players[i]);
    }
    return [firstTeam, secondTeam];
};

const totalTeamElo = async (teamArr) => {
    let totalElo = 0;
    const averages = await Promise.all(teamArr.map(player => {
        const average = getAverageScoreFromMatches(player.id);
        return average ? average : 100; //if the player is new give them a 100 cmbt score
    }));
    averages.forEach(player => totalElo += player.elo);
    return totalElo;
};

const  determineDisparity = async (teamsArr) => {
    const firstTeamElo = await totalTeamElo(teamsArr[0]);
    const secondTeamElo = await totalTeamElo(teamsArr[1]);
    const firstTeamAverageElo = firstTeamElo / teamsArr[0].length;
    const secondTeamAverageElo = secondTeamElo / teamsArr[1].length;
    return firstTeamAverageElo - secondTeamAverageElo;
};

module.exports = {
    setInGameName,
    scrim,
}

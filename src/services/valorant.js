const {
    getPlayerById,
    updatePlayerInGameName,
    insertPlayer,
    updatePlayerName,
    getPlayersInVoiceChannel,
} = require('../knex/dals/player.dal');
const {
    shuffle,
    splitTeams,
    determineDisparity,
} = require('../utils/scrim-utils');
const {
    getScoreAverageChangeMsg,
    getEveryonesAverageScore,
    recordCombatScores,
} = require('../utils/addMatch-utils');
const {
    request,
    formatJson
} = require('../utils/util');

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
    for (let [snowFlake, member] of channel.members) {
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

const addMatch = async (message) => {
    let response;
    for (let [snowFlake, attachment] of message.attachments) {
        response = await request('POST', {
            url: 'https://ft9v591wbd.execute-api.us-east-1.amazonaws.com/dev/ocr',
            body: JSON.stringify(attachment)
        });

        const cleanMessage = formatJson(response);
        const oldScores = await getEveryonesAverageScore(response); // todo create method
        console.log(oldScores);
        const newScores = await recordCombatScores(response); // todo create method
        const averageEloChange = getScoreAverageChangeMsg(newScores, oldScores);
        const averageEloChangeCleanMsg = formatJson(averageEloChange);
        message.channel.send('Recorded:\n' + cleanMessage);
        message.channel.send('\n\nElo change:\n' + averageEloChangeCleanMsg + "\n If you don't see your name here you need to add your in game name (!setign {your ign})")
    }
};

module.exports = {
    setInGameName,
    scrim,
    addMatch,
}

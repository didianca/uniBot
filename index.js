const Discord = require('discord.js');
const {Uni} = require('./uniBot');
const db = require('./db.js');
const util = require('./util');
const {prefix, token, giphyToken, ytToken} = require('./config');
const client = new Discord.Client();

const GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);
const fetch = require('node-fetch');
const helpMsg = `Welcome to Unibot:\n
!flip or !f - random coin flip.\n
!scrim or !s - start a scrim with all the players in Cheese Cake.\n
!done or !d - read end match image (1080 required) attachment parse and update players combat score.\n
!elo - reply with players average elo.\n`;

client.once('ready', async () => db.init());

client.on('message', async message => {
    const {content} = message;
    try {
        if (content.startsWith(`${prefix}uni`)) Uni(message);
        else if (content === 'ping') message.reply('pong');
        else if (content === '!flip' || content === '!f') message.reply(Math.round(Math.random()) === 1 ? ' ♕ Heads!' : ' ♘ Tails!');
        else if (content.startsWith('!scrim') || content.startsWith('!s')) try {
            await scrim(message);
        } catch (e) {
            console.log(e)
        }
        else if (content.startsWith('!done') || content === '!d') try {
            await addMatch(message);
        } catch (e) {
            console.log(e)
        }
        else if (content.startsWith('!elo')) try {
            await getElo(message);
        } catch (e) {
            console.log(e)
        }
        else if (content.startsWith('!helpme')) try {
            message.reply(helpMsg)
        } catch (e) {
            console.log(e)
        }
        else if (content.startsWith('!leaderboard')) try {
            const res = await db.getLeaderboard();
            const leaderboard = util.formatJson(res)
                .split('name').join('\n')
                .split('averageScore').join('')
                .split(':').join('')
                .split('[').join('')
                .split(']').join('');

            message.reply(leaderboard);
        } catch (e) {
            console.log(e)
        }
    } catch {
        message.reply('Hiccup...');
    }
});

const addMatch = async (message) => {
    let response;
    for (let [sf, attachment] of message.attachments) {
        console.log(attachment);
        response = await util.request('POST', {
            url: 'https://ft9v591wbd.execute-api.us-east-1.amazonaws.com/dev/ocr',
            body: JSON.stringify(attachment)
        });

        const cleanMessage = util.formatJson(response);
        const oldScores = await db.getEveryonesAverageScore(response);
        const newScores = await db.recordCombatScores(response);
        const averageEloChange = getScoreAverageChangeMsg(newScores, oldScores);
        const averageEloChangeCleanMsg = util.formatJson(averageEloChange);
        console.log(averageEloChangeCleanMsg);
        message.channel.send('Recorded:\n' + cleanMessage);
        message.channel.send('\n\nElo change:\n' + averageEloChangeCleanMsg + "\n If you don't see your name here you need to add your in game name (!setign {your ign})")
    }
};

const getScoreAverageChangeMsg = (oldScores, newScores) => {
    const scoreDifference = {};
    Object.keys(oldScores).forEach(user => {
        scoreDifference[user] = Math.round(oldScores[user].averageScore - newScores[user].averageScore);
    });
    return scoreDifference;
};

const getElo = async (message) => {
    const elo = await db.getAverageScore(message.author.id);
    console.log(elo);
    message.reply('Average Elo: ' + elo.averageScore);
};

let shuffleCounter = 0;
const scrim = async (message, disparityDifferenceThreshold = 0.1) => {
    const CHANNEL_CHEESE_CAKE = '310195830290382848';
    const channel = await client.channels.fetch(CHANNEL_CHEESE_CAKE);
    const usersInChannel = [];
    const memberIds = []; // our playerIds
    for (let [sf, member] of channel.members) {
        const name = member.nickname ? member.nickname : member.user.username;
        usersInChannel.push(name);
        memberIds.push(member.id);
        await db.insertPlayerIfNotExists(member.id, name);
    }
    if (usersInChannel.length < 2) {
        message.channel.send('Players must be in Cheese Cake Channel');
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

const splitTeams = (aggregateUsers) => {
    let split = false;
    const team0 = [];
    const team1 = [];
    for (let i = 0; i < aggregateUsers.length; i++) {
        if (i === Math.floor(aggregateUsers.length / 2)) split = true;
        if (split) team0.push(aggregateUsers[i]);
        else team1.push(aggregateUsers[i]);
    }
    return [team0, team1];
};

const determineDisparity = async (teamsArr) => {
    // console.log('TEAM 0', teamsArr[0]);
    // console.log('TEAM 1', teamsArr[1]);
    const team0Elo = await totalTeamElo(teamsArr[0]);
    const team1Elo = await totalTeamElo(teamsArr[1]);
    console.log(team1Elo);
    const team0AvgElo = team0Elo / teamsArr[0].length;
    const team1AvgElo = team1Elo / teamsArr[1].length;
    return [team0AvgElo, team1AvgElo];
};

const totalTeamElo = async (teamArr) => {
    let totalElo = 0;
    const averages = await Promise.all(teamArr.map(player => db.getAverageScore(player.id)));
    averages.forEach(player => totalElo += player.averageScore);
    return totalElo;
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
    const {content, channel} = msg;
    if (content.startsWith(`${prefix}yt`)) {
        const vidName = content.indexOf('!yt') + 1;
        const result = content.substring(vidName + 1);
        channel.send(await getVidLink(result));
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


const Discord = require('discord.js');
const fetch = require('node-fetch');
const { unicorn } = require('./services/unicorn');
const { youTube } = require('./services/youtube');
const { setInGameName, scrim, } = require('./services/valorant'); // todo wip
const { test } = require('./test'); //todo wip
const util = require('./util');
const {
    UNICORN_PREFIX,
    PING_PONG_PREFIX,
    COIN_FLIP_PREFIX,
    YOU_TUBE_PREFIX,
    VALORANT_SET_IGN_PREFIX,
    VALORANT_SCRIM_PREFIX,
    VALORANT_LEADERBOARD_PREFIX,
    VALORANT_ELO_PREFIX,
    VALORANT_DONE_PREFIX,
    DISCORD_TOKEN,
    YOU_TUBE_TOKEN
} = require('./config');
const { db } = require('./db.js');
const helpMsg = `Welcome to Unibot:\n
!flip or !f - random coin flip.\n
!scrim or !s - start a scrim with all the players in Cheese Cake.\n
!done or !d - read end match image (1080 required) attachment parse and update players combat score.\n
!elo - reply with players average elo.\n`;

const client = new Discord.Client();
client.login(DISCORD_TOKEN)
    .then(() => console.log('Connected to discord'))
    .catch(err => console.log(err));

client.once('ready', () => {
    console.log("Unicorn trotting!")
});

client.on('message', async message => {
    const { content, channel, author } = message;
    switch (true) {
        case (content.startsWith(UNICORN_PREFIX)):
            unicorn(message);
            break;
        case (content.startsWith(PING_PONG_PREFIX)):
            channel.send('pong');
            break;
        case (content.startsWith(COIN_FLIP_PREFIX)):
            channel.send(Math.round(Math.random()) === 1 ? ' ♕ Heads!' : ' ♘ Tails!');
            break;
        case (content.startsWith(YOU_TUBE_PREFIX)):
            console.log('wtf')
            const videoNameIndex = content.indexOf('!yt') + 1;
            const videoName = content.substring(videoNameIndex + 1);
            channel.send(await youTube(videoName));
            break;
        case (content.startsWith(VALORANT_SET_IGN_PREFIX)):
            const messageArray = content.split('');
            if( messageArray.length <= 7) {
                message.reply('You need to provide a valid in game name! No actions have been taken.')
                break;
            }
            const name = content.split('!setign ').join('')
            const result = await setInGameName(author.id, name);
            if (result) {
                message.reply('your in game name has been successfully updated')
            } else {
                message.reply('Something went wrong. No actions have been taken.')
            }
            break;
        case(content.startsWith(VALORANT_SCRIM_PREFIX)):
            await scrim(message);
            channel.send('Scrim command case works.');
            break;
        case(content.startsWith(VALORANT_LEADERBOARD_PREFIX)):
            channel.send('Lead board command case works.');
            break;
        case(content.startsWith(VALORANT_ELO_PREFIX)):
            channel.send('Elo command case works.');
            break;
        case(content.startsWith(VALORANT_DONE_PREFIX)):
            channel.send('Done command case works.')
            break;
    }
})

// UNICORN - !uni
// client.on('message', async message => {
//     const {content, author, reply } = message;
//     try {
//         if (content.startsWith('!scrim') || content.startsWith('!s')) try {
//             await scrim(message);
//         } catch (e) {
//             console.log(e)
//         }
//         else if (content.startsWith('!done') || content === '!d') try {
//             await addMatch(message);
//         } catch (e) {
//             console.log(e)
//         }
//         else if (content.startsWith('!elo')) try {
//             await getElo(message);
//         } catch (e) {
//             console.log(e)
//         }
//         else if (content.startsWith('!helpme')) try {
//             reply(helpMsg)
//         } catch (e) {
//             console.log(e)
//         }
//         else if (content.startsWith('!leaderboard')) try {
//             const res = await db.getLeaderboard(); // todo create method in db
//             const leaderboard = util.formatJson(res)
//                 .split('name').join('\n')
//                 .split('averageScore').join('')
//                 .split(':').join('')
//                 .split('[').join('')
//                 .split(']').join('');
//
//             reply(leaderboard);
//         } catch (e) {
//             console.log(e)
//         }
//     } catch {
//         reply('Hiccup...');
//     }
// });

// const addMatch = async (message) => {
//     let response;
//     for (let [sf, attachment] of message.attachments) {
//         console.log(attachment);
//         response = await util.request('POST', {
//             url: 'https://ft9v591wbd.execute-api.us-east-1.amazonaws.com/dev/ocr', // ??????
//             body: JSON.stringify(attachment)
//         });
//
//         const cleanMessage = util.formatJson(response);
//         const oldScores = await db.getEveryonesAverageScore(response); // todo create method
//         const newScores = await db.recordCombatScores(response); // todo create method
//         const averageEloChange = getScoreAverageChangeMsg(newScores, oldScores);
//         const averageEloChangeCleanMsg = util.formatJson(averageEloChange);
//         console.log(averageEloChangeCleanMsg);
//         message.channel.send('Recorded:\n' + cleanMessage);
//         message.channel.send('\n\nElo change:\n' + averageEloChangeCleanMsg + "\n If you don't see your name here you need to add your in game name (!setign {your ign})")
//     }
// };
//
// const getScoreAverageChangeMsg = (oldScores, newScores) => {
//     const scoreDifference = {};
//     Object.keys(oldScores).forEach(user => {
//         scoreDifference[user] = Math.round(oldScores[user].averageScore - newScores[user].averageScore); // ???
//     });
//     return scoreDifference;
// };
//
// const getElo = async (message) => {
//     const elo = await db.getAverageScore(message.author.id); // todo create method
//     console.log(elo);
//     message.reply('Average Elo: ' + elo.averageScore); // todo create method
// };

// const splitTeams = (aggregateUsers) => {
//     let split = false;
//     const team0 = [];
//     const team1 = [];
//     for (let i = 0; i < aggregateUsers.length; i++) {
//         if (i === Math.floor(aggregateUsers.length / 2)) split = true;
//         if (split) team0.push(aggregateUsers[i]);
//         else team1.push(aggregateUsers[i]);
//     }
//     return [team0, team1];
// };

// const  determineDisparity = async (teamsArr) => {
//     // console.log('TEAM 0', teamsArr[0]);
//     // console.log('TEAM 1', teamsArr[1]);
//     const team0Elo = await totalTeamElo(teamsArr[0]);
//     const team1Elo = await totalTeamElo(teamsArr[1]);
//     console.log(team1Elo);
//     const team0AvgElo = team0Elo / teamsArr[0].length;
//     const team1AvgElo = team1Elo / teamsArr[1].length;
//     return [team0AvgElo, team1AvgElo];
// };

// const totalTeamElo = async (teamArr) => {
//     let totalElo = 0;
//     const averages = await Promise.all(teamArr.map(player => {
//         const average = db.getAverageScore(player.id);
//         return average ? average : 125; //if the player is new give them a 125 cmbt score
//     }));
//     averages.forEach(player => totalElo += player.averageScore);
//     return totalElo;
// };

// const shuffle = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// };

// const request = async (verb, params) => {
//     let res;
//     res = verb.toUpperCase() === 'GET' ?
//         await fetch(
//             params.url, {
//                 method: verb,
//                 headers: params.headers
//             }) :
//         await fetch(
//             params.url, {
//                 method: verb,
//                 body: params.body,
//                 headers: params.headers
//             });
//     return await res.json();
// };


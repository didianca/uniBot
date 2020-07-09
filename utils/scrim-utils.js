const { getAverageScoreFromMatches } = require('../db')


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
    const averages = await Promise.all(teamArr.map(async (player) => {
        const average = await getAverageScoreFromMatches(player.id);
        const result = average.score ? average.score : 100;
        return result; //if the player is new give them a 100 cmbt score
    }));
    averages.forEach(playerAvgElo => totalElo += playerAvgElo);
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
    shuffle,
    splitTeams,
    totalTeamElo,
    determineDisparity,
}
const { db } = require('../db');

const scrim = async (message) => {
    const CHANNEL_CHEESE_CAKE = '310195830290382848';
    const channel = await client.channels.fetch(CHANNEL_CHEESE_CAKE);
    const usersInChannel = [];
    const memberIds = [];
    //console.log(channel.members);
    for (let [sf, member] of channel.members) {
        // console.log(member);
        console.log(member.id);
        const name = member.nickname ? member.nickname : member.user.username;
        usersInChannel.push(name);
        memberIds.push(member.id);
        sqllite.insertPlayerIfNotExists(member.id, name);
    }
    const allUsers = shuffle(usersInChannel);
    if (allUsers.length < 2) {
        message.channel.send('Players must be in Cheese Cake Channel');
        return;
    }
    let teamMessage = `> Team ${allUsers[0]}:\n`;
    console.log(allUsers);
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


        // todo: average the elo of all the players connected to the channel at the moment of scrimming and chose the average as a value for any new player with null 'players.last_elo' value
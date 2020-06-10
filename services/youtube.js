const {
    YOU_TUBE_TOKEN
} = require('../config');

module.exports.youTube = async (vidName) => {
    try {
        const encodedVidName = encodeURI(vidName);
        const params = {url: `https://www.googleapis.com/youtube/v3/search?part=id&maxResults=2&order=viewCount&type=video&key=${YOU_TUBE_TOKEN}&q=${encodedVidName}`};
        const response = await request('GET', params);
        const videoId = response.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (e) {
        console.log(e);
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
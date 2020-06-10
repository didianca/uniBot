const fetch = require('node-fetch');

module.exports.request = async (verb, params) => {
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

module.exports.formatJson = (json) =>  JSON.stringify(json)
    .split('{').join('')
    .split('"').join(' ')
    .split('}').join('')
    .split(',').join('\n');

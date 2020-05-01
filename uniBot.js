const quotes = require('./quotes');
module.exports.Uni = (message) => {
    let member = message.mentions.members.first() || "";
    giphy.search('gifs', {"q": ["magical", "unicorn", "animated candies", "fairyland"]})
        .then((response) => {
            //getting one gif
            let totalResponses = response.data.length;
            const responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
            let finalResponse = response.data[responseIndex];
            //getting one quote
            let totalQuotes = quotes.length;
            let quotesIndex = Math.floor((Math.random() * 10) + 1) % totalQuotes;
            let quote = quotes[quotesIndex];

            message.channel.send(`${quote} ${member} :unicorn:`, {
                files: [finalResponse.images.fixed_height.url]
            });
        })
        .catch(() => {
            message.channel.send('Hiccup...')
        });
};

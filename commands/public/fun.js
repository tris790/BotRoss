"use strict";

function Install(bot) {
    var ask = bot.registerCommand("ask", (msg, args) => {
        var response = ["Yes", "No", "Maybe", "I don't care!"];
        var rand = Math.floor(Math.random() * (response.length - 0)) + 0;
        return response[rand];
    }, {
        description: "Asks Bot Ross a question.",
        fullDescription: "The bot will answer your question.",
        usage: "<question>"
    });
}

module.exports.Install = Install;

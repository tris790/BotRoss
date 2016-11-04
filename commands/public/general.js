"use strict";

function Install(bot) {
    var echoCommand = bot.registerCommand("echo", (msg, args) => {
        if (args.length === 0) { 
            return "Invalid input";
        }
        var text = args.join(" ");
        return text;
    }, {
        description: "Make the bot say something.",
        fullDescription: "The bot will echo whatever is after the command label.",
        usage: "<text>"
    });
}

module.exports.Install = Install;

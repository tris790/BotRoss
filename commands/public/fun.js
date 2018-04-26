"use strict";
const rake = require("node-rake");
const emoj = require("emoj");
const emoji = require("moji-translate");

function Install(bot) {
    var ask = bot.registerCommand(
        "ask",
        (msg, args) => {
            var response = ["Yes", "No"];
            var rand = Math.floor(Math.random() * (response.length - 0)) + 0;
            return response[rand];
        },
        {
            description: "Asks Bot Ross a question.",
            fullDescription: "The bot will answer your question.",
            usage: "<question>",
            aliases: ["OuiOuNon"]
        }
    );
    var choose = bot.registerCommand(
        "choose",
        (msg, args) => {
            if (args.length === 0) return "Invalid input";
            var rand = Math.floor(Math.random() * args.length);
            return args[rand];
        },
        {
            description: "Let Bot Ross decide.",
            fullDescription: "The bot will choose between multiple options.",
            usage: "<choice choice choice ...>"
        }
    );

    var ban = bot.registerCommand(
        "ban",
        (msg, args) => {
            if (args.length == 0) return "ban who?";
            const userName = args.join(" ");
            var response = [
                "Yes",
                "For sure!",
                "I hate this guy",
                "He deserves it",
                "I don't even know who he is",
                "Ban HAMMMMMMMER",
                "Hold my beer, I'll handle this",
                `Hey @everyone , lets ban ${userName}`,
                `Bye bye, bye ${userName}`
            ];
            var rand = Math.floor(Math.random() * (response.length - 0)) + 0;
            return response[rand];
        },
        {
            description: "Asks Bot Ross if you should ban someone.",
            fullDescription: "The bot tell you if you should ban someone.",
            usage: "<name>"
        }
    );

    var autism = bot.registerCommand(
        "autism",
        async (msg, args) => {
            let usr = msg.author.username;
            if (args[0]) {
                usr = args.join(" ");
            }
            const rand = Math.floor(Math.random() * 100);
            return `${usr} is:  ${rand}% autistic!`;
        },
        {
            description: "Get your autism level.",
            fullDescription: "0-100, 100 being really autistic."
        }
    );

    var emojify = bot.registerCommand("emojify", async (msg, args) => {
        if (args[0]) {
            const keywords = rake
                .generate(args.join(" "))
                .join(" ")
                .split(" ");

            const emojies = keywords.map(word =>
                emoji.getAllEmojiForWord(word)
            );

            return emojies
                .reduce((acc, cur) => {
                    acc.push(cur[Math.floor(Math.random() * cur.length)]);
                    return acc;
                }, [])
                .join(" ");
        }
    });
}

module.exports.Install = Install;

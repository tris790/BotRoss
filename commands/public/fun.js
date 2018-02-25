"use strict";

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
            const fetch = require("node-fetch");
            const URL =
                "https://psychology-tools.com/autism-spectrum-quotient/score.php";
            const DATA = {
                number_of_questions: 50,
                submit: "Score+my+Answers",
                valid: 1,
                start: 1519509223
            };

            for (let i = 1; i <= 50; i++) {
                const rnd = Math.round(Math.random());
                DATA["q" + i] = rnd;
            }

            const b = Object.keys(DATA)
                .map(key => {
                    return (
                        encodeURIComponent(key) +
                        "=" +
                        encodeURIComponent(DATA[key])
                    );
                })
                .join("&");

            const PARAMS = {
                method: "POST",
                body: b,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            };

            const html = await fetch(URL, PARAMS).then(t => t.text());
            const result = html.match(
                /Your score was <span class="score">([0-9]{2})<\/span> out of a possible 50/
            )[1];
            return `${msg.author.username} is:  ${result *
                100 /
                50}% autistic! (${result} / 50)`;
        },
        {
            description: "Get your autism level.",
            fullDescription: "X/50, 50 being really autistic."
        }
    );
}

module.exports.Install = Install;

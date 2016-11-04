"use strict";

function Install(bot) {
    var evalCommand = bot.registerCommand("eval", (msg, args) => {
        try {
            return eval(args.join(" ").replace(/^`{3}|`{3}$/gm, ""));
        } catch (e) {
            if (e instanceof SyntaxError) {
                return e.message;
            }
        }
    }, {
            description: "Eval a string.",
            fullDescription: "Evaluate a string as code.",
            usage: "<StringToEval>",
            requirements: {
                userIDs: ["98209445493895168"]
            }
        });
    var deleteMessage = bot.registerCommand("delete", (msg, args) => {
        const num = parseInt(args[0]);
        if (num == null)
            num = 0;
        else if (num > 100)
            num = 100;
        if (num > 0)
            msg.channel.purge(num);
    }, {
            requirements: {
                permissions: { "administrator": true }
            }
        });
}
module.exports.Install = Install;

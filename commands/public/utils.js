"use strict";
const UTIL = require("util");

function Install(bot) {
    var userIDCommand = bot.registerCommand("id", (msg, args) => {
        if (args.length > 1) {
            try {
                let nameArray = args.join(" ").replace(/^@{1}/gm).split("#");
                const t = msg.guild.members.find((member) => {
                    if (member.user.username == nameArray[0] && member.user.discriminator == nameArray[1]) {
                        return true;
                    }
                });
                return t.user.id;
            } catch (e) {
                return "Error" + e;
            }
        } else if (args.length > 0) {
            var t = msg.guild.members.get(args[0]);
            return t.user.username;
        } else {
            return msg.member.id;
        }
    }, {
            description: "Get the userID or or someone else's.",
            fullDescription: "Get the userID or or someone else's.",
            usage: "<> or <UserName>"
        });
    var userIDCommand = bot.registerCommand("processinfo", (msg, args) => {
        console.log('Node version ................ ' + process.version);
        console.log('Platform .................... ' + process.platform);
        console.log('Memory usage ................ ' + UTIL.inspect(process.memoryUsage()));
    }, {

        });
}

module.exports.Install = Install;

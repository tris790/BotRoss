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
    var about = bot.registerCommand("about", (msg, args) => {
        return {
            content: "",
            embed: {
                title: "Bot Ross",
                url: "https://discordapp.com/oauth2/authorize?permissions=536345663&scope=bot&client_id=168214818459877376",
                description: bot.description,
                type: "rich",
                color: 0x738bd7,
                image: {
                    url: bot.user.avatarURL,
                    height: 50,
                    width: 50
                },
                fields: [{
                    name: "Servers",
                    value: `${bot.guilds.filter(() => {return true;}).length} total`,
                    inline: true
                }, {
                    name: "Uptime",
                    value: `${(bot.uptime / 3600000).toFixed(2)} hours`,
                    inline: true
                }, {
                    name: "Help",
                    value: `Type: ${bot.prefix}help to get a list of commands.`,
                    inline: false
                }],
                footer: {
                    text: bot.owner,
                    icon_url: "https://strongloop.com/wp-content/uploads/2015/12/nodejs-logo.png"
                }
            }
        }
    }, {});
}

module.exports.Install = Install;

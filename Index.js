"use strict";

const Auth = require("./auth.json");
const Config = require("./config.json");
const CommandHandler = require("./commands/commandhandler");
const FFmpeg = require("ffmpeg");
const Eris = require("eris");
const FS = require("fs");
var youtubedl = require('youtube-dl');


var bot = new Eris.CommandClient(Auth.discordtoken, {}, {
    description: Config.Description,
    owner: Config.Owner,
    prefix: Config.Prefix
});

var commandHandler = new CommandHandler();

bot.on("ready", () => {
    console.log(`Connected!\n${bot.user.username} (${bot.user.id})`);
    commandHandler.InstallCommands(bot);
});

commandHandler.on('installed', () => {
    console.log("Modules installed!");
});

commandHandler.on("error", (error) =>{
    console.log(error);
});

bot.connect();

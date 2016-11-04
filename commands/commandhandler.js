"use strict";
const Admin = require("./private/admin.js");
const Audio = require("./public/audio.js");
const General = require("./public/general.js");
const Utils = require("./public/utils.js");

var EventEmitter = require('eventemitter3');

class CommandHandler extends EventEmitter {
    constructor() {
        super();
        this.on("installed", () => {});
    }
    InstallCommands(bot) {
        try {
            Admin.Install(bot);
            Audio.Install(bot);
            General.Install(bot);
            Utils.Install(bot);
            this.emit("installed");
        } catch (e) {
            this.emit("error", "Command Install Error: " + e);
        }
    }
}

module.exports = CommandHandler;

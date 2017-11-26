'use strict';
const Admin = require('../commands/private/admin.js');
const Audio = require('../commands/public/audio.js');
const General = require('../commands/public/general.js');
const Fun = require('../commands/public/fun.js');
const Utils = require('../commands/public/utils.js');
const Hats = require("../commands/public/hats.js")

var EventEmitter = require('eventemitter3');

class CommandsMiddleware extends EventEmitter {
	constructor() {
		super();
	}

	get name() {
		return 'Commands';
	}

	load(bot) {
		return new Promise(resolve => {
			this.bot = bot;
			Admin.Install(bot);
			Audio.Install(bot);
			General.Install(bot);
			Fun.Install(bot);
			Utils.Install(bot);
			Hats.Install(bot);
			return resolve(this);
		});
	}
}

module.exports = CommandsMiddleware;

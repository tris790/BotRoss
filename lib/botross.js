//Packages
const Eris = require('eris');
//Local files
const ChatHandler = require('./chatHandler.js'),
	Logger = require('./logger.js');

var Promise;
try {
	Promise = require('bluebird');
} catch (err) {
	Promise = global.Promise;
}

class BotRoss extends Eris.CommandClient {
	constructor(options) {
		super(options.token, {}, options.eris);
		this.chatHandler = new ChatHandler();
		this.logger = new Logger();
		this.blacklistedUser = [];
		this.config = {};
		this.middleware = [];

		this.once('ready', () => {
			this.chatHandler.run();
			console.log('Bot ready!');
			//this.logger.info('Mirai: Connected to Discord');
		});
		// .on('error', (error, shard) => {
		// 	if (error) this.logger.error(`Mirai: Shard ${shard} error: `, error);
		// })
		// .on('disconnected', () => {
		// 	this.logger.warn('Mirai: Disconnected from Discord');
		// })
		// .on('shardReady', shard => {
		// 	this.logger.info(`Mirai: Shard ${shard} ready`);
		// })
		// .on('shardDisconnect', (error, shard) => {
		// 	if (error)
		// 		this.logger.warn(`Mirai: Shard ${shard} disconnected`, error.message);
		// })
		// .on('shardResume', shard => {
		// 	this.logger.info(`Mirai: Shard ${shard} resumed`);
		// });
	}
	get database() {
		if (!this._databaseIndex)
			this._databaseIndex = this.middleware.findIndex(
				m => m.name === 'MongoDatabase'
			);
		return this.middleware[this._databaseIndex];
	}
	loadMiddleware(middleware) {
		return middleware.load(this).then(() => {
			this.middleware.push(middleware);
		});
	}
	initializeConfig() {
		this.config = this.database
			.findOne('configs', {}, null, {
				mUseCache: true,
				lean: true
			})
			.then(doc => {
				console.log('Config loaded', doc);
			})
			.catch(err => console.log('Error loading config', err));
	}
}
module.exports = BotRoss;

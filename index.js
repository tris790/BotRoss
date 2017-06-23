const BotRoss = require('./lib/botross.js'),
	Auth = require('./auth.json'),
	botross = new BotRoss({
		token: Auth.discordtoken,
		eris: { prefix: '!' }
	}),
	MongoDB = require('./middleware/MongoMiddle'),
	Commands = require('./middleware/CommandsMiddle');
// ,
// AbstractCommandPlugin = require('mirai-bot-core/lib/Base/AbstractCommandPlugin');

global.Promise = require('bluebird');
botross
	.connect()
	.then(() => {
		botross.loadMiddleware(new MongoDB());
	})
	.then(() => {
		botross.loadMiddleware(new Commands());
	})
	.then(() => botross.initializeConfig())
	.catch(e => console.log(e));

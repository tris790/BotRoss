const BotRoss = require('./lib/botross.js'),
	Auth = require('./auth.json'),
	botross = new BotRoss({
		token: Auth.discordtoken,
		eris: { prefix: '!' }
	}),
	MongoDB = require('./middleware/MongoMiddle');
// ,
// AbstractCommandPlugin = require('mirai-bot-core/lib/Base/AbstractCommandPlugin');

global.Promise = require('bluebird');
botross
	.connect()
	.then(() => {
		botross.loadMiddleware(new MongoDB());
	})
	.then(() => botross.initializeConfig())
	// .then(() => botross.loadCommandPlugin(MongoTest))
	.catch(e => console.log(e));

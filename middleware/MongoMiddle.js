//packages
const Mongoose = require('mongoose'),
	Schema = Mongoose.Schema;
//local files
const Auth = require('../auth.json');

const configSchema = new Schema({
	Description: String,
	Library: String,
	Owner: String,
	Prefix: String,
	Volume: Number
});

class MongoDBMiddleware {
	constructor(
		options = {
			URI: Auth.dburl
		}
	) {
		this.URI = options.URI;
		this.models = { configs: Mongoose.model('configs', configSchema) };
		this.cache = { configs: {} };
	}

	get name() {
		return 'MongoDatabase';
	}

	load(bot) {
		return new Promise(resolve => {
			this.bot = bot;
			Mongoose.Promise = global.Promise;
			Mongoose.connect(this.URI);
			// Mongoose.connection.on(
			// 	'error',
			// 	this.bot.logger.error.bind(this.bot.logger, 'Mongoose error:')
			// );
			// Mongoose.connection.once('open', () =>
			// 	this.bot.logger.info('Mongoose Connected')
			// );
			return resolve(this);
		});
	}

	destroy() {
		return new Promise(resolve => {
			this.bot = undefined;
			Mongoose.disconnect();
			Mongoose.connection.removeAllListeners('error');
			Mongoose.connection.removeAllListeners('open');
			return resolve();
		});
	}

	invalidate(collection, id) {
		if (
			this.cache.hasOwnProperty(collection) &&
			this.cache[collection].hasOwnProperty(id)
		)
			delete this.cache[collection][id];
	}

	findOne(collection, conditions, projection, options = {}) {
		if (options.mUseCache === true && options.lean === true && !projection) {
			if (this.cache[collection].hasOwnProperty(conditions.id))
				return Promise.resolve(this.cache[collection][conditions.id]);

			return this.models[collection]
				.findOne(conditions, projection, options)
				.then(resp => {
					this.cache[collection][conditions.id] = resp;
					return resp;
				});
		}
		return this.models[collection].findOne(conditions, projection, options);
	}

	update(collection, conditions, doc, options) {
		if (conditions.hasOwnProperty('id'))
			this.invalidate(collection, conditions.id);

		return this.models[collection].update(conditions, doc, options);
	}

	remove(collection, conditions) {
		if (conditions.hasOwnProperty('id'))
			this.invalidate(collection, conditions.id);

		return this.models[collection].remove(conditions);
	}
}

module.exports = MongoDBMiddleware;

// Do not bundle!

import _ from 'underscore';
import Backbone from 'backbone';
import dbConnector from './../../db/connector.js';

class Model extends Backbone.Model {

	get dbCollection() { return 'atlas_researchers'; }

	constructor(options) {
		super(options);
	}

	isDomainAuthorized() {
		return ([ 'newamerica.org', 'opentechinstitute.org', 'wiredcraft.com' ].indexOf(this.get('domain')) > -1);
	}

	parse(raw) {
		if (raw._id) {
			raw.id = raw._id;
			delete raw._id;
		}
		return raw;
	}

	setEncryptedFieldSync(key, value) {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(value, salt);
		this.set('encrypted_' + key, hash);
	}

	compareEncryptedFieldSync(key, value) {
		return bcrypt.compareSync(value, this.get('encrypted_' + key));
	}

	toMongoJSON() {
		var json = this.toJSON();
		json._id = json.id;
		delete json.id;
		return json;
	}

	toSessionJSON() {
		return {
			id: this.get('id')
		};
	}

	toClientJSON() {
		return {
			displayName: this.get('displayName'),
			name: this.get('name'),
			image: this.get('image')
		};
	}

	getSavePromise() {

		return new Promise((resolve, reject) => {

			return dbConnector.then((db) => {

				var collection = db.collection('atlas_researchers');

				collection.update({ _id: this.get('id') }, this.toMongoJSON(), { upsert: true }, (err, json) => {

					if (err) { return reject(err); }
					console.log('user saved successfully');
					resolve(this);

				});

			}, (err) => { reject(err); });

		});
		
	}

	getRetrievePromise() {

		console.log('retrieving');

		return new Promise((resolve, reject) => {

			return dbConnector.then((db) => {

				var collection = db.collection('atlas_researchers'),
					cursor = collection.find({ _id: this.get('id') });

				cursor.toArray((err, json) => {

					if (err) { return reject(err); }
					this.set(this.parse(json[0]));
					resolve(this);

				});

			}, (err) => { reject(err); });

		});

	}

}

class Collection extends Backbone.Collection {

	get dbCollection() { return 'atlas_researchers'; }

	constructor(options) {
		super(options);
		this.model = Model;
		this.url = '/api/v1/floors';
	}

}

export default {
	Model: Model,
	Collection: Collection
};
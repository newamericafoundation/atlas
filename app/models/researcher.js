// Do not bundle!
import _ from 'underscore'
import Backbone from 'backbone'
import dbConnector from './../../db/connector.js'

const AUTHORIZED_DOMAINS = [ 'newamerica.org', 'opentechinstitute.org', 'wiredcraft.com' ]

export class Model extends Backbone.Model {

	get dbCollection() { return 'atlas_researchers' }

	isDomainAuthorized() {
		return (AUTHORIZED_DOMAINS.indexOf(this.get('domain')) > -1)
	}

	parse(raw) {
		if (raw._id) {
			raw.id = raw._id
			delete raw._id
		}
		return raw
	}

	toMongoJSON() {
		var json = this.toJSON()
		json._id = json.id
		delete json.id
		return json
	}

	toSessionJSON() {
		return { id: this.get('id') }
	}

	toClientJSON() {
		return {
			displayName: this.get('displayName'),
			name: this.get('name'),
			image: this.get('image')
		}
	}

	getSavePromise() {

		return new Promise((resolve, reject) => {

			return dbConnector.then((db) => {

				var collection = db.collection('atlas_researchers');

				collection.update({ _id: this.get('id') }, this.toMongoJSON(), { upsert: true }, (err, json) => {

					if (err) { return reject(err) }
					console.log('user saved successfully')
					resolve(this)

				});

			}, (err) => { reject(err) })

		})
		
	}

	getRetrievePromise() {

		return new Promise((resolve, reject) => {

			return dbConnector.then((db) => {

				var collection = db.collection('atlas_researchers')
				var cursor = collection.find({ _id: this.get('id') })

				cursor.toArray((err, json) => {

					if (err) { return reject(err) }
					this.set(this.parse(json[0]))
					resolve(this)

				})

			}, (err) => { reject(err) })

		})

	}

}
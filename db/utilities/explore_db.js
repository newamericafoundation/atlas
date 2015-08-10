var MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectID,
	config = require('../atlas_config.json');

var fixForeignKeyType = function(prj) {
	return {
		$set: {
			project_section_id:  String(prj.project_section_id),
			project_template_id: String(prj.project_template_id)
		}
	};
};

var populateProjectSectionIdsArray = function(prj) {
	return {
		$set: {
			project_section_ids: [ prj.project_section_id ]
		}
	};
};

var removeProjectSectionIds = function(prj) {
	return {
		$unset: {
			project_section_id: ""
		}
	};
};

var stringifyIds = function(prj) {
	return {
		$set: {
			id: String(prj.id)
		}
	};
};

var setLive = function(prj) {
	return {
		$set: {
			is_live: "Yes"
		}
	};
};

var fixShutterstockCredits = function(img) {
	var credit = img.credit;
	if (credit.replace) {
		credit = credit.replace('(Shutterstock)', '[Shutterstock]');
	}
	return {
		$set: {
			credit: credit
		}
	}
};

var batchUpdate = function(env, collectionName, updateFunction) {

	MongoClient.connect('mongodb://' + config.dbUrl[env] + ':27017/mongoid', function(err, db) {
		if(err) { return console.log(err); }

		var collection = db.collection(collectionName);

		var cursor = collection.find({});

		// this object logs the progress of the operation
		//   and closes the database connection when done.
		var tracker = {
			found: 0,
			updated: 0,
			cursorEnded: false,
			logFound: function() {
				this.found += 1;
			},
			logUpdated: function() {
				this.updated += 1;
				this._closeIfDone();
			},
			logCursorEnd: function() {
				this.cursorEnded = true;
				this._closeIfDone();
			},
			_isDone: function() {
				return this.cursorEnded && (this.found === this.updated);
			},
			_closeIfDone: function() {
				if (this._isDone()) {
					console.log('operation complete, closing database');
					db.close();
				}
			}
		};

		cursor.each(function(err, item) {

			if (err) { console.log(err); }

			if (item != null) {

				tracker.logFound();

				var query,
					update = updateFunction(item);

				if (item['_id']) {
					query = { '_id': item['_id'] };
				} else {
					query = { id: item['id'] }
				}

				collection.update(query, update, function(err) { 
					if (err) { console.log(err); }
					tracker.logUpdated();
				});

			} else { tracker.logCursorEnd(); }

		});

	});

};

batchUpdate(
	'development', 
	'images', 
	fixShutterstockCredits
);
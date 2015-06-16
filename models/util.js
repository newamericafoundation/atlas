// General model utility methods.

var util = {};

/*
 * Adapts MongoDB id's, removing _id keys and $oid inner wrappers.
 * ! Destructive ! No deep copy is created.
 * @param {object} model - Json model.
 * @returns {object} model - Adapted model.
 */
util.adaptId = function(model) {
	if (typeof model._id !== "undefined") {
		if (typeof model._id.$oid !== "undefined") {
			model.id = String(model._id.$oid);
		} else {
			model.id = model._id;
		}
		delete model._id;
	} else if(typeof model.id !== "undefined" && typeof model.id.$oid !== "undefined") {
		model.id = String(model.id.$oid);
	}
	return model;
};

/*
 * Find by id.
 *
 */
util.findById = function(models, id) {
	var i, max, model;
	for (i = 0, max = models.length; i < max; i += 1) {
		model = models[i];
		if (String(model.id) === String(id)) {
			return model;
		}
	}
};

/*
 * Checks if two comma-separated lists of tags share a common tag.
 * @param {string} tags1 - Comma-separated tags list.
 * @param {string} tags2 - Comma-separated tags list.
 * @returns {boolean}
 */
util.isTagShared = function(tags1, tags2) {

	if ((tags1 === '') || (tags2 === '')) { return false; }

	var splitTags1 = tags1.split(','),
		splitTags2 = tags2.split(','),
		areMatching = false,
		i, max, tag1;

	for (i = 0, max = splitTags1.length; i < max; i += 1) {
		tag1 = splitTags1[i];
		if (splitTags2.indexOf(tag1) > -1) { 
			return true;
		}
	}
	return false;
};

module.exports = util;
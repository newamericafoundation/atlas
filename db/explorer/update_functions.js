// This is a collection of batch update operations applied on Atlas' database.
// As many of these were used to change the data structure, they may not be applicable.
// Use as templates for new operations, and feel free to modify. Nothing to break here :).
export default {

	// Method used to test the batch update workflow.
	testMethod: function(prj) {
		return {
			$set: { 'puppies': true }
		};
	},

	// Convert foreign key ids to strings.
	fixForeignKeyType: function(prj) {
		return {
			$set: {
				project_section_id:  String(prj.project_section_id),
				project_template_id: String(prj.project_template_id)
			}
		};
	},

	// Turn a foreign key id into an array of foreign key ids.
	populateProjectSectionIdsArray: function(prj) {
		return {
			$set: {
				project_section_ids: [ prj.project_section_id ]
			}
		};
	},

	// Remove field.
	removeProjectSectionIds: function(prj) {
		return {
			$unset: {
				project_section_id: ""
			}
		};
	},

	stringifyIds: function(prj) {
		return {
			$set: {
				id: String(prj.id)
			}
		};
	},

	setLive: function(prj) {
		return {
			$set: {
				is_live: "Yes"
			}
		};
	},

	fixShutterstockCredits: function(img) {
		var credit = img.credit;
		if (credit.replace) {
			credit = credit.replace('(Shutterstock)', '[Shutterstock]');
		}
		return {
			$set: {
				credit: credit
			}
		}
	}

}
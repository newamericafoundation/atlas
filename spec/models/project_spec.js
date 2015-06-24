var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	project = require('./../../app/models/project');


describe('project.Model', function() {

	var model = new project.Model();

	describe('is_related_to', function() {

		it('returns true if there is a shared tag', function() {
			var prj1 = new project.Model({ tags: 'tag1,tag2,tag3' });
			var prj2 = new project.Model({ tags: 'tag4,tag5,tag1' });
			assert.equal(prj1.isRelatedTo(prj2), true);
		});

		it('returns false if there is no shared tag', function() {
			var prj1 = new project.Model({ tags: 'tag1,tag2,tag3' });
			var prj2 = new project.Model({ tags: 'tag4,tag5,tag9' });
			assert.equal(prj1.isRelatedTo(prj2), false);
		});
		
	});
});
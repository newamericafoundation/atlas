var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	project = require('./../../app/models/project');


describe('project.Model', function() {

	var model = new project.Model();

	describe('isRelatedTo', function() {

		it('returns true if there is a shared tag', function() {
			var prj1 = new project.Model({ tags: 'tag1,tag2,tag3' });
			var prj2 = new project.Model({ tags: 'tag4,tag5,tag1' });
			assert.equal(prj1.isRelatedTo(prj2), true);
		});

		it('returns false if there is not a shared tag', function() {
			var prj1 = new project.Model({ tags: 'tag1,tag2,tag3' });
			var prj2 = new project.Model({ tags: 'tag4,tag5,tag9' });
			assert.equal(prj1.isRelatedTo(prj2), false);
		});
		
	});
});


describe('project.Collection', function() {

	var collection = new project.Collection();

	describe('comparator', function() {

		var modelData1, modelData2, modelData3, modelData4;
		return beforeEach(function() {
			modelData1 = {
				id: 1,
				title: 'C',
				is_section_overview: 'Yes'
			};
			modelData2 = {
				id: 2,
				title: 'B',
				is_section_overview: 'Yes'
			};
			modelData3 = {
				id: 3,
				title: 'Xtitla',
				is_section_overview: 'No'
			};
			modelData4 = {
				id: 4,
				title: 'Xtitl',
				is_section_overview: 'No'
			};
		});

		it('sorts by title if both (or neither) are section overviews', function() {
			var coll = new project.Collection([ modelData1, modelData2 ]);
			return (coll.models[0].get('id')).should.equal(2);
		});

		it('sorts the section overview first if one is a section overview and one is not', function() {
			// test like above, once that's working
		});

		it('passes integration test for four models', function() {
			// ditto above
		});
	
	});
});

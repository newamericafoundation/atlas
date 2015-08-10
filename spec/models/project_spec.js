var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	project = require('./../../app/models/project.js');


describe('project.Model', function() {


	var model = new project.Model();


	describe('url', function() {

		it('creates url by concatenating atlas url to root url', function() {
			var urlRoot = '/api/v1/projects';
			pm = new project.Model({ atlas_url: 'folder/subfolder' });
			assert.equal(pm.url(), '/api/v1/projects?atlas_url=folder/subfolder');
		});

	});


	describe('buildUrl', function() {

		it('creates url by concatenating id to root build url', function() {
			pm = new project.Model({ id: 234 });
			assert.equal(pm.buildUrl(), 'http://build.atlas.newamerica.org/projects/234/edit');
		});

	});


	describe('exists', function() {

		it('returns true if project has mandatory fields', function() {
			pm = new project.Model({ id: 1, a: 'first', b: 'second' });
			assert.equal(pm.exists(), true);
		});

		it('returns false if project is missing id', function() {
			pm = new project.Model({ a: 'first', b: 'second' });
			assert.equal(pm.exists(), false);
		});

		it('returns false if project only has one key', function() {
			pm = new project.Model({ id: 1 });
			assert.equal(pm.exists(), false);
		});

	});


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


	/** 
	 * Failing (1st passes, second fails). 
	 * But, unsure if queryString should be key within model object?
	 */
	describe('url', function() {

		var modelData1 = { id: 1, title: 'C', atlas_url: 'nice-project', queryString: 'something' },
			base = '/api/v1/projects';
			
		//Test that it recognizes queryString
		it('returns query string', function() {
			var pc = new project.Collection([ modelData1 ]);
			assert.equal(pc.models[0].get('queryString'), 'something');
		});
		
		//Actual is just base url when this runs, doesn't find queryString
		it('creates url by concatenating query string to base url', function() {
			var pc = new project.Collection([ modelData1 ]);
			pc.queryString = 'atlas_url=nice-project';
			assert.equal(pc.url(), '/api/v1/projects?atlas_url=nice-project');
		});

	});


	describe('comparator', function() {

		var modelData1 = { id: 1, title: 'C', is_section_overview: 'Yes' },
			modelData2 = { id: 2, title: 'B', is_section_overview: 'Yes' },
			modelData3 = { id: 3, title: 'Xtitla', is_section_overview: 'No' },
			modelData4 = { id: 4, title: 'Xtitl', is_section_overview: 'No' };

		it('sorts by title if both (or neither) are section overviews', function() {
			var pc = new project.Collection([ modelData1, modelData2 ]);
			assert.equal(pc.models[0].get('id'), 2);
		});

		it('sorts the section overview first if one is a section overview and one is not', function() {
			var pc = new project.Collection([ modelData3, modelData1 ]);
			assert.equal(pc.models[0].get('id'), 1);
		});

		it('still passes sort test with four models', function() {
			var pc = new project.Collection([ modelData1, modelData2, modelData3, modelData4 ]);
			assert.equal(pc.models[0].get('id'), 2);
		});

	});

});

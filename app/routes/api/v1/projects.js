import express from 'express'
import csv from 'csv'

import * as project from './../../../models/project.js'
import * as base from './../../../models/base.js'

import { ensureAuthenticated, ensureNothing } from './../../../middleware/auth.js'

import { list, show, create, update, remove } from './../../../middleware/crud/index.js'

// Researcher is always authenticated if the environment is not production.
var currentAuthMiddleware = (process.NODE_ENV === 'production') ? ensureAuthenticated : ensureNothing

var router = express.Router()

router.get('/', list.bind(this, { dbCollectionName: 'projects', authQuery: { is_live: 'Yes' } }), (req, res) => {

	var models = base.Collection.prototype.parse(req.dbResponse)

	var coll = new project.Collection(models)

	// Get related models.
	if (req.special_query == null) {
		return res.json(coll.toJSON())
	} 
	
	return res.json(coll.related_to(req.special_query.related_to))

})

router.get('/:id', show.bind(this, { dbCollectionName: 'projects', authQuery: { is_live: 'Yes' } }), (req, res) => {
	res.json(req.dbResponse)
})

// authenticated requests
router.put('/:id/edit', currentAuthMiddleware, update.bind(this, { dbCollectionName: 'projects', authQuery: { is_live: 'Yes' } }), (req, res) => {
	res.json(req.dbResponse)
})

router.post('/', currentAuthMiddleware, create.bind(this, { dbCollectionName: 'projects', authQuery: { is_live: 'Yes' } }), (req, res) => {
	res.json(req.dbResponse)
})

router.delete('/:id', currentAuthMiddleware, remove.bind(this, { dbCollectionName: 'projects', authQuery: { is_live: 'Yes' } }), (req, res) => {
	res.json(req.dbResponse)
})


var shouldHideDraftProjects = function(req) {
	// Unsafe setting to test back-end while in development, skipping the auth step which is required at each server restart.
	return (process.env.NODE_ENV === 'production') ? !req.isAuthenticated() : false
}

// Print project data.
router.post('/print', (req, res) => {

	var queryParams = req.body || {}
	var fileName = queryParams.atlas_url || 'file'
	var fields = { data: 1, atlas_url: 1 }

	if (shouldHideDraftProjects(req)) {
		queryParams.is_live = "Yes"
	}

	var { db } = req

	var cursor = db.collection('projects').find(queryParams, fields)

	cursor.toArray(function(err, models) {
		if (err) { console.dir(err) }
		if ((models[0]) && (models[0].data) && (models[0].data.items)) {
			return res.csv(models[0].data.items, fileName + '.csv')
		}
		res.send()
	})

})

export default router
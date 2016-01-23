import express from 'express'
import json2csv from 'nice-json2csv'
import React from 'react'

import authRouter from './auth.js'
import apiRouter from './api/v1/index.js'

import fingerprintManifest from './utilities/fingerprint_manifest.js'
import matchReactComponent from './utilities/match_react_component.jsx'


var router = express.Router()

// Use json to csv decorator to allow csv downloads from the project.
router.use(json2csv.expressDecorator)


// Authentication routes.
router.get('/login', (req, res) => { res.render('login', fingerprintManifest) })

router.get('/logout', (req, res) => { 
	req.logout() 
	res.redirect('/')
})

router.use('/auth', authRouter)


// Data API routes.
router.use('/api/v1', apiRouter)


// Main routes - routing done by client.
router.get('*', /* matchReactComponent, */ (req, res) => {
	var opt = fingerprintManifest
	opt.user = req.user
	res.render('index.jade', opt)
})

export default router
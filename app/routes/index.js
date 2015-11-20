import express from 'express'
import json2csv from 'nice-json2csv'

import React from 'react'
import { match, RoutingContext } from 'react-router'

import authRouter from './auth.js'

import fingerprintManifest from './utilities/fingerprint_manifest.js'

const DATA_API_RESOURCES = [ 'projects', 'images' ]

var router = express.Router()
router.use(json2csv.expressDecorator)

router.get('/login', (req, res) => {
	res.render('login', fingerprintManifest);
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

// Authentication routes.
router.use('/auth', authRouter)

// Use subroutes for data api, requiring resource-specific subrouters.
DATA_API_RESOURCES.forEach((resource) => {
	var url = `/api/v1/${resource}`
	router.use(url, require('.' + url).default)
})

// Main routes - routing done by client.
router.get('*', (req, res) => {
	var opt = fingerprintManifest
	opt.user = req.user
	res.render('index.jade', opt)
})

export default router
import express from 'express'
import * as base from './../../../models/base.js'

import { ensureAuthenticated, ensureNothing } from './../../../middleware/auth.js'

import { list, show, create, update, remove } from './../../../middleware/crud/index.js'

import defaultResponder from './../helpers/default_responder.js'

// Researcher is always authenticated if the environment is not production.
var currentAuthMiddleware = (process.NODE_ENV === 'production') ? ensureAuthenticated : ensureNothing

var router = express.Router()

const standardOptions = { dbCollectionName: 'images' }

// Public (unauthenticated) API calls.
router.get('/', list.bind(this, standardOptions), defaultResponder)
router.get('/:id', show.bind(this, standardOptions), defaultResponder)

// Authenticated API calls.
router.post('/:id/edit', currentAuthMiddleware, update.bind(this, standardOptions), defaultResponder)
router.post('/', currentAuthMiddleware, create.bind(this, standardOptions), defaultResponder)
router.delete('/:id', currentAuthMiddleware, remove.bind(this, standardOptions), defaultResponder)

export default router
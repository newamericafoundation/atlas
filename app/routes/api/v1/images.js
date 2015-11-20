import express from 'express'
import * as base from './../../../models/base.js'

import authMiddleware from './../../../middleware/auth.js'
import deleteMiddleware from './../../../middleware/crud/delete.js'
import newMiddleware from  './../../../middleware/crud/new.js'
import updateMiddleware from './../../../middleware/crud/update.js'
import showMiddleware from './../../../middleware/crud/show.js'
import indexMiddleware from './../../../middleware/crud/index.js'

// Unsafe setting to test back-end while in development, skipping the auth step which is required at each server restart.
//var currentAuthMiddleware = (process.NODE_ENV === 'production') ? authMiddleware.ensureAuthenticated : authMiddleware.ensureNothing;
var currentAuthMiddleware = authMiddleware.ensureAuthenticated;

var router = express.Router()

var standardResponder = (req, res) => {
	res.json(req.dbResponse)
}

var standardOptions = { dbCollectionName: 'images' }

router.get('/', indexMiddleware.bind(this, standardOptions), standardResponder)

router.get('/:id', showMiddleware.bind(this, standardOptions), standardResponder)

// authenticated requests
router.post('/:id/edit', currentAuthMiddleware, updateMiddleware.bind(this, standardOptions), standardResponder)

router.post('/', currentAuthMiddleware, newMiddleware.bind(this, standardOptions), standardResponder)

router.delete('/:id', currentAuthMiddleware, deleteMiddleware.bind(this, standardOptions), standardResponder)

export default router
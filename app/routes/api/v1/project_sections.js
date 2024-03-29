import express from 'express'

import authMiddleware from './../../../middleware/auth.js'
import { list } from './../../../middleware/crud/index.js'
import defaultResponder from './../helpers/default_responder.js'

var router = express.Router()

router.get('/', list.bind(this, { dbCollectionName: 'project_sections' }), defaultResponder)

export default router
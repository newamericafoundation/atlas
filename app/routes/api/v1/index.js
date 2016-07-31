import express from 'express'

import imagesRouter from './images.js'
import projectsRouter from './projects.js'
import projectSectionsRouter from './project_sections.js'
import projectTemplatesRouter from './project_templates.js'

// Create subrouter.
var router = express.Router()

// Use router for each resource.
router.use('/projects', projectsRouter)
router.use('/projects_sections', projectSectionsRouter)
router.use('/projects_templates', projectTemplatesRouter)
router.use('/images', imagesRouter)

// Handle not found route.
router.get('*', (req, res) => {
	res.sendStatus(404)
})

export default router
import { combineReducers } from 'redux'

import projectEntitiesReducer from './projects.js'
import projectSectionEntitiesReducer from './project_sections.js'
import projectTemplateEntitiesReducer from './project_templates.js'

export default combineReducers({
	projects: projectEntitiesReducer,
	projectSections: projectSectionEntitiesReducer,
	projectTemplates: projectTemplateEntitiesReducer
})
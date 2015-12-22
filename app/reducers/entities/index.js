import { combineReducers } from 'redux'

import projectEntitiesReducer from './projects.js'

export default combineReducers({
	projects: projectEntitiesReducer
})
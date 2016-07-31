import { combineReducers } from 'redux'

import entitiesReducer from './entities/index.js'
import flashReducer from './flash.js'
import authenticatedResearcherReducer from './authenticated_researcher.js'
import uiReducer from './ui/index.js'

export default combineReducers({
	authenticatedResearcher: authenticatedResearcherReducer,
	entities: entitiesReducer,
	flash: flashReducer,
	ui: uiReducer
})
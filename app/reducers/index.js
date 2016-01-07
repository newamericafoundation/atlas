import { combineReducers } from 'redux'

import entitiesReducer from './entities/index.js'
import flashReducer from './flash.js'
import authenticatedResearcherReducer from './authenticated_researcher.js'

export default combineReducers({
	authenticatedResearcher: authenticatedResearcherReducer,
	entities: entitiesReducer,
	flash: flashReducer
})
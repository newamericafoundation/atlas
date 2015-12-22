import { combineReducers } from 'redux'

import entitiesReducer from './entities/index.js'

export default combineReducers({
	entities: entitiesReducer
})
import { combineReducers } from 'redux'

import entitiesReducer from './entities/index.js'
import flashReducer from './flash.js'

export default combineReducers({
	entities: entitiesReducer,
	flash: flashReducer
})
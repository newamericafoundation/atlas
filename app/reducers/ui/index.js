import { combineReducers } from 'redux'

import dimensionsReducer from './dimensions.js'
import stateReducer from './state.js'

export default combineReducers({
	dimensions: dimensionsReducer,
	state: stateReducer
})
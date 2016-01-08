export default function dimensionsReducer(state = {}, action) {

	var { type, data } = action

	switch(type) {

		case 'SET_UI_DIMENSIONS':
			return Object.assign({}, state, data)

		default:
			return state

	}

}
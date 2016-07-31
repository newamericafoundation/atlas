export default function stateReducer(state = {}, action) {

	var { type, data } = action

	switch(type) {

		case 'SET_UI_STATE':
			return Object.assign({}, state, data)

		default:
			return state

	}

}
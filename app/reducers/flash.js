export default function flashReducer(state = '', action) {

	var { type, data } = action

	switch(type) {

		case 'SET_FLASH_MESSAGE':
			return data

		case 'REMOVE_FLASH_MESSAGE':
			return ''

		default:
			return state

	}

}
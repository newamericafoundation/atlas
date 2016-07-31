export default function projectSectionEntitiesReducer(state = [], action) {

	var { type, data } = action

	switch(type) {

		case 'FETCH_PROJECT_SECTIONS_SUCCESS':
			return data

		default:
			return state

	}

}
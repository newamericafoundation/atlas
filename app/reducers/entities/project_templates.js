export default function projectTemplateEntitiesReducer(state = [], action) {

	var { type, data } = action

	switch(type) {

		case 'FETCH_PROJECT_TEMPLATES_SUCCESS':
			return data

		default:
			return state

	}

}
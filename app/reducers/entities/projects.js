export default function projectEntitiesReducer(state = {}, action) {

	var { type, data } = action

	switch(type) {

		case 'FETCH_PROJECT_SUMMARIES_SUCCESS':
			return Object.assign({}, state, { summaries: data })

		case 'FETCH_PROJECT_SUMMARIES_ERROR':
			return Object.assign({}, state, { summaries: 'error' })

		case 'FETCH_PROJECT_SUCCESS':
			let change = {}
			// Support both simple objects and Backbone models.
			let url = data.get ? data.get('atlas_url') : data.atlas_url
			change[url] = data
			return Object.assign({}, state, { byUrl: Object.assign({}, state.byUrl || {}, change) })

		case 'FETCH_PROJECT_ERROR':
			return state

		default:
			return state

	}

}
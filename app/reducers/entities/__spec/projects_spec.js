import 'babel-polyfill'

import assert from 'assert'

import projectEntitiesReducer from './../projects.js'

describe('projectEntitiesReducer', () => {

	it('sets project summaries', () => {

		var action = { type: 'FETCH_PROJECT_SUMMARIES_SUCCESS', data: [ 'project_1', 'project_2' ] }
		var state = { someAttribute: 'some attribute value' }

		assert.deepEqual(projectEntitiesReducer(state, action), {
			someAttribute: 'some attribute value',
			summaries: [ 'project_1', 'project_2' ]
		})

	})

	it('sets project by url', () => {

		var action = { type: 'FETCH_PROJECT_SUCCESS', data: { atlas_url: 'some-url', title: 'some title' } }
		var state = { 
			someAttribute: 'some attribute value',
			byUrl: {
				'some-existing-url': { 
					atlas_url: 'some-existing-url', 
					title: 'some existing title' 
				}
			}
		}

		assert.deepEqual(projectEntitiesReducer(state, action), {
			someAttribute: 'some attribute value',
			byUrl: {
				'some-existing-url': { 
					atlas_url: 'some-existing-url', 
					title: 'some existing title' 
				},
				'some-url': { 
					atlas_url: 'some-url', 
					title: 'some title' 
				} 
			}
		})

	})

})
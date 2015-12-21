import 'babel-polyfill'

import assert from 'assert'

import defaultResponder from './../default_responder.js'

describe('defaultResponder', () => {

	it('sends db response as json', () => {
		var response = null
		var req = { dbResponse: { message: 'hello' } }
		var res = { json: function(jsonResponse) { response = jsonResponse } }
		defaultResponder(req, res)
		assert.deepEqual(response, { message: 'hello' })
	})

})
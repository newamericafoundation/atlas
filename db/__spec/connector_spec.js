import 'babel-polyfill'

import assert from 'assert'

import dbConnector from './../connector.js'

describe('dbConnector', () => {

	it('is a promise: has a then method of the type function', () => {
		assert.equal(typeof dbConnector.then, 'function')
	})

})
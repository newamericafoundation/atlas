import 'babel-polyfill'

import assert from 'assert'

import utilities from './../utilities.js'

describe('removeQueryString', () => {

	var { removeQueryString } = utilities

	it('removes query string', () => {
		assert.equal(removeQueryString('example.com?a=b'), 'example.com')
	})

})
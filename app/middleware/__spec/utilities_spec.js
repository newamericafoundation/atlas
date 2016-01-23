import 'babel-polyfill'

import assert from 'assert'

import { removeQueryString } from './../utilities.js'

describe('removeQueryString', () => {

	it('removes query string', () => {
		assert.equal(removeQueryString('example.com?a=b'), 'example.com')
	})

})
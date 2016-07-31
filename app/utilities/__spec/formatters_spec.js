import 'babel-polyfill'

import assert from 'assert'
import _ from 'underscore'

import formatters from './../formatters.js'

describe('formatters', () => {

	describe('removeLineBreaks', () => {

		var { removeLineBreaks } = formatters

		it('removes line break if it contains multiple lines', () => {
			assert.deepEqual(removeLineBreaks('nice\n basket'), 'nice basket');
		})

	})


	describe('removeSpaces', () => {

		var { removeSpaces } = formatters

		it('removes spaces if it contains spaces', () => {
			assert.deepEqual(removeSpaces(' ni ce b ask et '), 'nicebasket');
		})

	})

})
import 'babel-polyfill'

import assert from 'assert'

import React from 'react'
import { isElement, isCompositeComponent, mockComponent } from 'react-addons-test-utils'
import Layout from './../layout.jsx'

describe('Layout', () => {

	it('creates a React element', () => {
		var el = <Layout />
		assert.equal(isElement(el), true)
	})

})
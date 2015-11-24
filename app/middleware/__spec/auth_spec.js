import 'babel-polyfill'

import assert from 'assert'

import auth from './../auth.js'

import { Req, Res } from './req_res_mocks.js'

describe('auth', () => {

	describe('ensureAuthenticated', () => {

		var { ensureAuthenticated } = auth

		it('redirects to login path and does not call callback if not authenticated', () => {
			var isCallbackCalled = false
			var req = new Req({ isAuthenticated: false })
			var res = new Res()
			ensureAuthenticated(req, res, function() { isCallbackCalled = true })
			assert.equal(res.hasRedirectedTo, '/login')
			assert.equal(isCallbackCalled, false)
		})

		it('calls callback and does not redirect if authenticated', () => {
			var isCallbackCalled = false
			var req = new Req({ isAuthenticated: true })
			var res = new Res()
			ensureAuthenticated(req, res, function() { isCallbackCalled = true })
			assert.equal(res.hasRedirectedTo, null)
			assert.equal(isCallbackCalled, true)
		})

	})


	describe('ensureAdminAuthenticated', () => {

		var { ensureAdminAuthenticated } = auth

		it('redirects to login path and does not call callback if authenticated but not admin', () => {
			var isCallbackCalled = false
			var req = new Req({ isAuthenticated: true, authenticatedUser: { isAdmin: false } })
			var res = new Res()
			ensureAdminAuthenticated(req, res, function() { isCallbackCalled = true })
			assert.equal(res.hasRedirectedTo, '/login')
			assert.equal(isCallbackCalled, false)
		})

	})


	describe('ensureNothing', () => {

		var { ensureNothing } = auth

		it('calls callback and does not redirect for an authenticated user', () => {
			var isCallbackCalled = false
			var req = new Req({ isAuthenticated: true })
			var res = new Res()
			ensureNothing(req, res, function() { isCallbackCalled = true })
			assert.equal(res.hasRedirectedTo, null)
			assert.equal(isCallbackCalled, true)
		})

		it('calls callback and does not redirect for a not authenticated user', () => {
			var isCallbackCalled = false
			var req = new Req({ isAuthenticated: false })
			var res = new Res()
			ensureNothing(req, res, function() { isCallbackCalled = true })
			assert.equal(res.hasRedirectedTo, null)
			assert.equal(isCallbackCalled, true)
		})

	})


})
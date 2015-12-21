// Mocks request and response objects in order to test middleware.

/*
 * Mocks an authenticated request object constructor.
 *
 */
export class Req {

	constructor(options) {
		// Set whether the request is authenticated through options.
		this._isAuthenticated = options.isAuthenticated
		this.user = options.authenticatedUser
	}

	isAuthenticated() {
		return this._isAuthenticated
	}

}


/*
 * Mocks an authenticated response object constructor.
 *
 */
export class Res {

	constructor() {
		// Property that can be checked.
		this.hasRedirectedTo = null
	}

	redirect(redirectPath) {
		this.hasRedirectedTo = redirectPath
	}

}
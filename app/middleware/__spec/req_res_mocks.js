// Mocks request and response objects in order to test middleware.

export class Req {

	constructor(options) {
		this._isAuthenticated = options.isAuthenticated
		this.user = options.authenticatedUser
	}

	isAuthenticated() {
		return this._isAuthenticated
	}

}



export class Res {

	constructor() {
		// Property that can be checked.
		this.hasRedirectedTo = null
	}

	redirect(redirectPath) {
		this.hasRedirectedTo = redirectPath
	}

}
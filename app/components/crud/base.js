// Base model extending to all CRUD components. Includes utilities to build up forms (no significant logic).

import React from 'react'

import Static from './../general/static.jsx'


export default class Base extends Static {

	// This is a dummy, and should always be set on the subclass.
	render() {
		return <div/>
	}

	getResourceConstructor() {
		return Backbone.Model
	}

	getResourceName() {
		var Model = this.getResourceConstructor()
		return Model.prototype.resourceName
	}

}
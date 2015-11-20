// Base model extending to all CRUD components. Includes utilities to build up forms (no significant logic).

import React from 'react';

import Static from './../general/static.jsx';

class Base extends Static {

	/*
	 * Customize on subclass.
	 *
	 */
	render() {
		return (<div/>);
	}


	/*
	 * Customize on subclass.
	 *
	 */
	getResourceConstructor() {
		return Backbone.Model;
	}


	/*
	 *
	 *
	 */
	getResourceName() {
		var Model = this.getResourceConstructor();
		return Model.prototype.resourceName;
	}

}

export default Base;
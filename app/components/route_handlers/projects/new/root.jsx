import React from 'react';
import NewBase from './../../../crud/new_base.js';

import project from './../../../../models/project.js';

class New extends NewBase {

	/*
	 *
	 *
	 */
	getResourceConstructor() {
		return project.Model;
	}

}

export default New;
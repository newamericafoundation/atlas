import React from 'react';
import EditBase from './../../../crud/edit_base.js';

import project from './../../../../models/project.js';

class Edit extends EditBase {

	/*
	 *
	 *
	 */
	getResourceConstructor() {
		return project.Model;
	}

}

Edit.contextTypes = {
	router: React.PropTypes.func
};

export default Edit;
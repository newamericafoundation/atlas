import React from 'react';
import classNames from 'classnames';

import DeleteBase from './../../../crud/delete_base.js';

import project from './../../../../models/project.js';

class Delete extends DeleteBase {

	getResourceConstructor() {
		return project.Model;
	}

}

Delete.contextTypes = {
	router: React.PropTypes.func
};

export default Delete;
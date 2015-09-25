import React from 'react';
import classNames from 'classnames';

import DeleteBase from './../../../crud/delete_base.js';

import image from './../../../../models/image.js';

class Delete extends DeleteBase {

	getResourceConstructor() {
		return image.Model;
	}

}

Delete.contextTypes = {
	router: React.PropTypes.func
};

export default Delete;
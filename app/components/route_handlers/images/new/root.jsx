import React from 'react';
import NewBase from './../../../crud/new_base.js';

import image from './../../../../models/image.js';

class New extends NewBase {

	/*
	 *
	 *
	 */
	getResourceConstructor() { return image.Model; }
	
}

export default New;
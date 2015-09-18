import React from 'react';
import EditBase from './../../../crud/edit_base.js';

import image from './../../../../models/image.js';

class Edit extends EditBase {
	getResourceName() { return 'image'; }
	getResourceConstructor() { return image.Model; }
}

Edit.contextTypes = {
	router: React.PropTypes.func
};

export default Edit;
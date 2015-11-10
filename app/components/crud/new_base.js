import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import SaveBase from './save_base.js';

/*
 *
 *
 */
class NewBase extends SaveBase {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			saveResponseStatus: undefined
		};
	}


	/*
	 *
	 *
	 */
	componentWillMount() {
		var Model = this.getResourceConstructor();
		if (!this.state.model) {
			this.setState({ model: new Model() });
		}
	}


	/*
	 *
	 *
	 */
	getCrudMethodName() {
		return 'new';
	}


	/*
	 *
	 *
	 */
	getSubmitButtonText() {
		return `Create ${this.getResourceName()}`;
	}


	/*
	 *
	 *
	 */
	saveModel(formData) {

		var model = this.state.model;

		// Set status to pending.
		this.setState({ saveResponseStatus: 'pending' });

		// Call before save method on the model.
		if (model.beforeSave) {
			model.beforeSave();
		}

		model.set('created_at', new Date().toISOString());

		// While pending, save form data using the instance method on the model.
		model.getClientSavePromise().then((res) => {
			res = JSON.parse(res);
			model.set('id', res.id);
			this.setState({ saveResponseStatus: res.status });
		}, (err) => { 
			if (err) { 
				console.log(err.stack); 
			} 
			this.setState({ saveResponseStatus: 'error' }) 
		}).catch((err) => { console.log(err.stack); }); 

	}

}

export default NewBase;
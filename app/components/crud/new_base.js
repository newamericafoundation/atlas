import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import project from './../../models/project.js';

import SaveBase from './save_base.js';

class New extends SaveBase {

	constructor(props) {
		super(props);
		this.state = {
			saveResponseStatus: undefined
		};
	}

	componentWillMount() {
		if (!this.state.model) {
			this.setState({ model: new project.Model() });
		}
	}

	getCrudMethodName() {
		return 'new';
	}

	// Customize on subclass.
	getResourceName() {
		return 'project';
	}

	// Customize on subclass.
	getResourceConstructor() {
		return new Backbone.Model();
	}

	getSubmitButtonText() {
		return 'Create Project';
	}

	saveModel(formData) {

		var model = this.state.model;

		// Set status to pending.
		this.setState({ saveResponseStatus: 'pending' });

		// Call before save method on the model.
		if (model.beforeSave) {
			model.beforeSave();
		}

		// While pending, save form data using the instance method on the model.
		model.getClientSavePromise().then((res) => {
			console.log(res);
			res = JSON.parse(res);
			model.set('id', res.id);
			this.setState({ saveResponseStatus: res.status });
		}, (err) => { this.setState({ saveResponseStatus: 'error' }); 
		});

	}

}

export default New;
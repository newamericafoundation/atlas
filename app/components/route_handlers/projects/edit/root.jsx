import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

import project from './../../../../models/project.js';

import SaveBase from './../../../crud/save_base.js';

class Edit extends SaveBase {

	constructor(props) {
		super(props);
		this.state = {
			saveResponseStatus: undefined
		};
	}

	getCrudMethodName() {
		return 'edit';
	}

	getSubmitButtonText() {
		return 'Update Project';
	}

	componentWillMount() {
		if(!this.state.model) {
			this.fetchModel();
		}
	}

	fetchModel() {
		if (!this.props.params) { return; }
		var id = this.props.params.id;
		var model = new project.Model({ id: id });
		model.getClientFetchPromise({ id: id }).then((model) => {
			this.setState({ model: model });
		});
	}

	saveModel() {
		
		var model = this.state.model;

		this.setState({ saveResponseStatus: 'pending' });

		if (model.beforeSave) {
			model.beforeSave();
		}

		model.getClientUpdatePromise().then((res) => {
			res = JSON.parse(res);
			this.setState({ saveResponseStatus: res.status });
		}, (err) => { 
			this.setState({ saveResponseStatus: 'error' });
		});

	}

}

Edit.contextTypes = {
	router: React.PropTypes.func
};

export default Edit;
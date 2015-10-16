import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

import SaveBase from './save_base.js';

class EditBase extends SaveBase {

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
	getCrudMethodName() {
		return 'edit';
	}


	/*
	 *
	 *
	 */
	componentWillMount() {
		if(!this.state.model) {
			this.fetchModel();
		}
	}


	/*
	 *
	 *
	 */
	fetchModel() {
		if (!this.props.params) { return; }
		var id = this.props.params.id;
		var Model = this.getResourceConstructor();
		var model = new Model({ id: id });
		model.getClientFetchPromise({ id: id }).then((model) => {
			this.setState({ model: model });
		});
	}


	/*
	 *
	 *
	 */
	saveModel() {
		
		var model = this.state.model;

		this.setState({ saveResponseStatus: 'pending' });

		if (model.beforeSave) {
			model.beforeSave();
		}

		model.set('updated_at', new Date().toISOString());

		model.getClientUpdatePromise().then((res) => {
			res = JSON.parse(res);
			this.setState({ saveResponseStatus: res.status });
		}, (err) => { 
			this.setState({ saveResponseStatus: 'error' });
		});

	}

}

EditBase.contextTypes = {
	router: React.PropTypes.func
};

export default EditBase;
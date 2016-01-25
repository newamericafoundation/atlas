import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import SaveBase from './save_base.js';


export default class NewBase extends SaveBase {

	constructor(props) {
		super(props)
		this.state = {
			saveResponseStatus: null
		}
	}

	componentWillMount() {
		var Model = this.getResourceConstructor()
		if (!this.state.model) {
			this.setState({ model: new Model() })
		}
	}

	getCrudMethodName() {
		return 'new'
	}

	getSubmitButtonText() {
		return `Create ${this.getResourceName()}`
	}

	addModelTimeStamp() {
		var { model } = this.state
		model.set('created_at', new Date().toISOString())
	}

	saveModel(formData) {

		var { model } = this.state

		// Set status to pending.
		this.setState({ saveResponseStatus: 'pending' })

		// Call before save method on the model.
		if (model.beforeSave) { model.beforeSave() }

		this.addModelTimeStamp()

		// While pending, save form data using the instance method on the model.
		model.getClientSavePromise().then((res) => {
			res = JSON.parse(res)
			if (res.id != null) { model.set('id', res.id) }
			this.setState({ saveResponseStatus: res.status })
		}).catch((err) => { 
			console.log(err.stack)
			this.setState({ saveResponseStatus: 'error' }) 
		})

	}

}
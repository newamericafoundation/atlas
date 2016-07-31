import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

import SaveBase from './save_base.js'


export default class EditBase extends SaveBase {

	constructor(props) {
		super(props)
		this.state = { saveResponseStatus: null }
	}

	getCrudMethodName() {
		return 'edit'
	}

	componentWillMount() {
		if(!this.state.model) {
			this.fetchModel()
		}
	}

	fetchModel() {
		if (!this.props.params) { return; }
		var { id } = this.props.params
		var Model = this.getResourceConstructor()
		var model = new Model({ id: id })
		model.getClientFetchPromise({ id: id }).then((model) => {
			this.setState({ model: model })
		}).catch((err) => { console.log(err.stack); })
	}

	addModelTimeStamp() {
		var { model } = this.state
		model.set('updated_at', new Date().toISOString())
	}

	saveModel() {
		
		var { model } = this.state

		this.setState({ saveResponseStatus: 'pending' })

		if (model.beforeSave) { model.beforeSave() }

		this.addModelTimeStamp()

		model.getClientUpdatePromise().then((res) => {
			res = JSON.parse(res)
			if (res.id != null) { model.set('id', res.id) }
			this.setState({ saveResponseStatus: res.status })
		}).catch((err) => { this.setState({ saveResponseStatus: 'error' }) })

	}

}
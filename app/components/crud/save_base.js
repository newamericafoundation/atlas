// This component is used generically for crud forms on any resource.

import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

import Static from './../general/static.jsx'
import Form from './../form/root.jsx'
import Loader from './../general/loader.jsx'
import Base from './base.js'
import BaseStatusModal from './base_status_modal.js'


/*
 *
 *
 */
class SaveBaseModal extends BaseStatusModal {

	/*
	 *
	 *
	 */
	renderSuccessContent() {
		return (
			<div>
				<p className='title'>Save successful</p>
				<ul>
					{ this.renderLinks() }
				</ul>
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderFailureContent() {
		return (
			<div>
				<p className='title'>Save failed</p>
				<ul>
					<li><a className='link' onClick={this.reactivateForm.bind(this)} href='/'>Keep Editing</a></li>
				</ul>
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderPendingContent() {
		return (
			<div>
				<p className='title'>Saving...</p>
			</div>
		)
	}

}



/*
 *
 *
 */
class SaveBase extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.setStickyPageNav = this.setStickyPageNav.bind(this)
		this.reactivateForm = this.reactivateForm.bind(this)
		this.state = {
			model: null,
			saveResponseStatus: null
		}
	}

	/*
	 *
	 *
	 */
	render() {
		var style = { 'overflowY': 'scroll' }
		return (
			<div className='atl'>
				<div className='atl__main fill-parent' style={style} onScroll={ this.setStickyPageNav }>
					{ this.renderTitleBar('solid') }
					{ this.renderContentBar() }
				</div>
				{ this.renderModal() }
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderModal() {
		var { saveResponseStatus, model } = this.state
		if (!saveResponseStatus) { return }
		return (
			<SaveBaseModal
				model={model}
				status={saveResponseStatus}
				reactivateForm={this.reactivateForm}
			/>
		)
	}


	/*
	 *
	 *
	 */
	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>{ `${this.getCrudMethodName()} ${this.getResourceName()}` }</h1>
				{ this.renderLinks() }
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderLinks() {
		var { model } = this.state
		if (!model) { return }
		var name = model.resourceName
		var indexLink = (model.getIndexUrl()) ? (<li><Link className='link' to={model.getIndexUrl()}>{ `View all ${name}s` }</Link></li>) : null
			// there should be no edit or delete links if the model is empty
		var newLink = (model.get('id') && model.getNewUrl()) ? (<li><Link className='link' to={model.getNewUrl()}>{ `Create new ${name}` }</Link></li>) : null
		var deleteLink = (model.get('id') && model.getDeleteUrl()) ? (<li><Link className='link' to={model.getDeleteUrl()}>{ `Delete this ${name}` }</Link></li>) : null
		return (
			<ul>
				{ indexLink }
				{ newLink }
				{ deleteLink }
			</ul>
		)
	}


	/*
	 *
	 *
	 */
	renderPageNavContent() {
		return (
			<div>
				<p>Later on, we can put things here that help navigate the entry form.</p>
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderPageContent() {
		var { model, saveResponseStatus } = this.state
		var isFormEnabled = (saveResponseStatus == null)
		if (!model) { return <Loader /> }
		return (
			<div className="static-content">
				<Form
					history={ this.props.history }
					model={ this.state.model }
					isEnabled={ isFormEnabled }
					submitButtonText={ this.getSubmitButtonText() }
					onSubmit={ this.saveModel.bind(this) }
				/>
			</div>
		)
	}


	// Define on subclass.
	getCrudMethodName() { return 'new' }

	// Define on subclass.
	getSubmitButtonText() { return 'Submit' }


	/*
	 *
	 *
	 */
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


	/*
	 *
	 *
	 */
	reactivateForm() {
		this.setState({ saveResponseStatus: null })
	}

}

export default SaveBase
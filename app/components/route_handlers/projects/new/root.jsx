import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Static from './../../../general/static.jsx';
import Form from './../../../form/root.jsx';
import Modal from './../../../general/modal.jsx';

import project from './../../../../models/project.js';

class FormModal extends Modal {

	constructor(props) {
		super(props);
	}

	renderContent() {
		if(this.props.status === 'success') {
			return this.renderSuccessContent();
		}
		return this.renderFailureContent();
	}

	renderSuccessContent() {
		return (
			<div>
				<p className='title'>Save successful</p>
				<ul>
					<li><Link className='link' to={this.props.model.getEditUrl()}>Edit Project</Link></li>
					<li><Link className='link' to={this.props.model.getViewUrl()}>View Project</Link></li>
					<li><Link className='link' to='/projects/new'>Create another project</Link></li>
				</ul>
			</div>
		);
	}

	renderFailureContent() {
		return (
			<div>
				<p className='title'>Save failed</p>
				<ul>
					<li><a className='link' onClick={this.reactivateForm.bind(this)} href='/'>Keep Editing</a></li>
				</ul>
			</div>
		);
	}

	reactivateForm(e) {
		e.preventDefault();
		this.props.reactivateForm();
	}

}

class New extends Static {

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

	render() {
		return (
			<div className='atl atl--explainer'>
				<div className='atl__main fill-parent' onScroll={ this.setStickyPageNav.bind(this) }>
					{ this.renderTitleBar('solid') }
					{ this.renderContentBar() }
				</div>
				{ this.renderModal() }
			</div>
		);
	}

	renderModal() {
		if (this.state.saveResponseStatus) {
			return (
				<FormModal 
					model={this.state.model}
					status={this.saveResponseStatus}
					reactivateForm={this.reactivateForm.bind(this)}
				/>
			);
		}
	}

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>New Project</h1>
				<ul>
					<li>Updated: {  }</li>
				</ul>
			</div>
		);
	}

	renderPageNavContent() {
		return (
			<div>
				<p>Create a new project</p>
			</div>
		);
	}

	reactivateForm() {
		this.setState({ saveResponseStatus: undefined });
	}

	renderPageContent() {
		var isFormEnabled = (this.state.saveResponseStatus == null);
		return (
			<div className="static-content">
				<Form 
					model={ this.state.model }
					isEnabled={ isFormEnabled }
					submitButtonText="Create Project"
					onSubmit={ this.saveModel.bind(this) }
				/>
			</div>
		);
	}
	
	saveModel(formData) {

		// Set status to pending.
		this.setState({ saveResponseStatus: 'pending' });

		// Call before save method on the model.
		this.state.model.beforeSave();

		// While pending, save form data using the instance method on the model.
		this.state.model.getClientSavePromise().then((res) => {

			console.log(res);

			var model = this.state.model;
			res = JSON.parse(res);
			model.set('id', res.id);
			this.setState({ saveResponseStatus: res.status });

		}, (err) => { this.setState({ saveResponseStatus: 'error' }); });

	}

}

export default New;
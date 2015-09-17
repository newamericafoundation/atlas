// This component is used generically for crud forms on any resource.

import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Static from './../general/static.jsx';
import Form from './../form/root.jsx';
import Modal from './../general/modal.jsx';
import Loading from './../general/loading.jsx';

import SideBar from './../general/side_bar.jsx';

var buttons = [
	{ 
		title: 'Explore Atlas',
		contentType: 'inner-link',
		url: '/menu',
		reactIconNames: [ 'Grid' ],
		isToggleable: false 
	}
];

class SaveBaseModal extends Modal {

	constructor(props) {
		super(props);
	}

	renderContent() {
		if(this.props.status === 'success') { return this.renderSuccessContent(); }
		if(this.props.status === 'failure') { return this.renderFailureContent(); }
		return this.renderPendingContent();
	}

	renderSuccessContent() {
		var resourceName = this.props.model.name;
		return (
			<div>
				<p className='title'>Save successful</p>
				<ul>
					<li><Link className='link' to={this.props.model.getEditUrl()}>{ `Edit ${name}` }</Link></li>
					<li><Link className='link' to={this.props.model.getViewUrl()}>{ `View ${name}` }</Link></li>
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

	renderPendingContent() {
		return (
			<div>
				<p className='title'>Saving...</p>
			</div>
		);
	}

	reactivateForm(e) {
		e.preventDefault();
		this.props.reactivateForm();
	}

}

class SaveBase extends Static {

	constructor(props) {
		super(props);
		this.state = {
			model: undefined,
			saveResponseStatus: undefined
		};
	}

	// Define on subclass.
	componentWillMount() {
		// obtain project model, either by creating a new one or fetching one from the db
	}

	// Define on subclass.
	getCrudMethodName() {
		return 'new';
	}

	// Define on subclass.
	getSubmitButtonText() {
		return 'Submit';
	}

	// Define on subclass.
	saveModel(formData) {

		var model = this.state.model;

		// Set status to pending.
		this.setState({ saveResponseStatus: 'pending' });

		// Call before save method on the model.
		model.beforeSave();

		// While pending, save form data using the instance method on the model.
		model.getClientSavePromise().then((res) => {
			res = JSON.parse(res);
			model.set('id', res.id);
			this.setState({ saveResponseStatus: res.status });
		}, (err) => { this.setState({ saveResponseStatus: 'error' }); 
		});

	}

	// Generic
	render() {
		var style = { 'overflow-y': 'scroll' };
		return (
			<div className='atl'>
				<SideBar buttons={buttons} />
				<div className='atl__main fill-parent' style={style} onScroll={ this.setStickyPageNav.bind(this) }>
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
				<SaveBaseModal
					model={this.state.model}
					status={this.state.saveResponseStatus}
					reactivateForm={this.reactivateForm.bind(this)}
				/>
			);
		}
	}

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>{ `${this.getCrudMethodName()} ${this.getResourceName()}` }</h1>
				<ul>
					<li>Updated: {  }</li>
				</ul>
			</div>
		);
	}

	renderPageNavContent() {
		return (
			<div>
				<p>Project project project</p>
			</div>
		);
	}

	reactivateForm() {
		this.setState({ saveResponseStatus: undefined });
	}

	renderPageContent() {
		var isFormEnabled = (this.state.saveResponseStatus == null);
		if (!this.state.model) { return (<Loading />); }
		return (
			<div className="static-content">
				<Form 
					model={ this.state.model }
					isEnabled={ isFormEnabled }
					submitButtonText={ this.getSubmitButtonText() }
					onSubmit={ this.saveModel.bind(this) }
				/>
			</div>
		);
	}

	getResourceName() {
		return this.state.model ? this.state.model.name : 'item';
	}
	
}

export default SaveBase;
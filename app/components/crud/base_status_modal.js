// Base class for a modal window that pops up when a model is saved.

import React from 'react';
import Modal from './../general/modal.jsx';


class BaseStatusModal extends Modal {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
	}


	/*
	 *
	 *
	 */
	renderContent() {
		if(this.props.status === 'success') { return this.renderSuccessContent(); }
		if(this.props.status === 'failure') { return this.renderFailureContent(); }
		return this.renderPendingContent();
	}


	/*
	 *
	 *
	 */
	renderSuccessContent() {
		var resourceName = this.props.model.name;
		return (
			<div>
				<p className='title'>Save successful</p>
				<ul>
					{ this.renderLinks() }
				</ul>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderLinks() {
		var urls = [ 
			{ name: 'edit', url: this.props.model.getEditUrl() }, 
			{ name: 'view', url: this.props.model.getViewUrl() } 
		];
		return urls.map((url, i) => {
			if (!url.url) { return; }
			return (
				<li key={i}>
					<a className='link' href={url.url}>
						{ `${url.name} ${this.props.model.resourceName}` }
					</a>
				</li>
			);
		});
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
		);
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
		);
	}


	/*
	 *
	 *
	 */
	reactivateForm(e) {
		e.preventDefault();
		this.props.reactivateForm();
	}

}


export default BaseStatusModal;
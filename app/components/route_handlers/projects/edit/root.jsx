import React from 'react';
import classNames from 'classnames';
import Static from './../../../general/static.jsx';
import Form from './../../../form/root.jsx';
import Loading from './../../../general/loading.jsx';
import Modal from './../../../general/modal.jsx';

import { Link } from 'react-router';

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
				<p className='title'>Update successful</p>
				<ul>
					<li><a className='link' onClick={this.reactivateForm.bind(this)} href='/'>Keep Editing</a></li>
					<li><Link className='link' to={this.props.model.getViewUrl()}>View Project</Link></li>
					<li><Link className='link' to='/projects/new'>Create another project</Link></li>
				</ul>
			</div>
		);
	}

	renderFailureContent() {
		return (
			<div>
				<p className='title'>Update failed</p>
				<a className='link' onClick={this.reactivateForm.bind(this)} href='/'>Keep Editing</a>
				<Link className='link' to='/projects/new'>Start Over</Link>
			</div>
		);
	}

	reactivateForm(e) {
		e.preventDefault();
		this.props.reactivateForm();
	}

}

class Edit extends Static {

	constructor(props) {
		super(props);
		this.state = {
			saveResponseStatus: undefined
		};
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
					status={this.state.saveResponseStatus}
					reactivateForm={this.reactivateForm.bind(this)}
				/>
			);
		}
	} 

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>Edit Project</h1>
				<ul>
					<li>
						<Link className="icon-button" to={this.getViewUrl()} target="_blank">
							<div className="icon-button__icon bg-img-link--off-white"></div>
							<div className="icon-button__text">View Project</div>
						</Link>
					</li>
				</ul>
			</div>
		);
	}

	getViewUrl() {
		if (!this.state.model) { return '/'; }
		return '/' + this.state.model.get('atlas_url');
	}

	renderPageNavContent() {
		return (
			<div>
				<p>I navigate the page!</p>
			</div>
		);
	}

	renderPageContent() {
		var bulk = this.state.model ? this.renderForm() : <Loading />
		return (
			<div className="static-content">
				{ bulk }
			</div>
		);
	}

	reactivateForm() {
		this.setState({ saveResponseStatus: undefined });
	}

	renderForm() {
		var isFormEnabled = (this.state.saveResponseStatus == null);
		return (
			<Form 
				model={ this.state.model }
				isEnabled={ isFormEnabled }
				submitButtonText="Edit Project" 
				onSubmit={ this.updateModel.bind(this) }
			/>
		);
	}

	componentDidMount() {
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

	updateModel() {
		
		this.setState({ saveResponseStatus: 'pending' });

		this.state.model.beforeSave();

		this.state.model.getClientUpdatePromise().then((res) => {
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
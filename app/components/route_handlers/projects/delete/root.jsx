import React from 'react';
import classNames from 'classnames';
import Static from './../../../general/static.jsx';
import Form from './../../../form/root.jsx';
import Loading from './../../../general/loading.jsx';
import Modal from './../../../general/modal.jsx';
import _ from 'underscore';

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
		var resourceName = this.props.model.name;
		return (
			<div>
				<p className='title'>Delete successful</p>
				<ul>
					<li><Link className='link' to='/menu'>{ `View all ${name}s` }</Link></li>
				</ul>
			</div>
		);
	}

	renderFailureContent() {
		return (
			<div>
				<p className='title'>Delete failed</p>
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

class Delete extends Static {

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
				<h1 className='title'>{ `Delete ${this.getResourceName()}` }</h1>
				<ul>
					<li>
						<Link className="icon-button" to={this.getViewUrl()} target="_blank">
							<div className="icon-button__icon bg-img-link--off-white"></div>
							<div className="icon-button__text">{ `View ${this.getResourceName()}` }</div>
						</Link>
						<Link className="icon-button" to={this.getEditUrl()} target="_blank">
							<div className="icon-button__icon bg-img-link--off-white"></div>
							<div className="icon-button__text">{ `Edit ${this.getResourceName()}` }</div>
						</Link>
					</li>
				</ul>
			</div>
		);
	}

	getViewUrl() {
		if (!this.state.model) { return '/'; }
		return this.state.model.getViewUrl();
	}

	getEditUrl() {
		if (!this.state.model) { return '/'; }
		return this.state.model.getEditUrl();
	}

	renderPageNavContent() {
		return (
			<div>
				<p>I navigate the page!</p>
			</div>
		);
	}

	renderPageContent() {
		var bulk = this.state.model ? this.renderSummary() : <Loading />
		return (
			<div className="static-content">
				{ bulk }
			</div>
		);
	}

	renderSummary() {
		return (
			<div>
				<p>You are about to irreversibly delete this project. You may be able to get it back from the database backups, but I sure would not count on that.</p>
				<p>Remember, you can always make the project invisible to the public by visiting its edit link.</p>
				<p>If you are still positive, hit the link below:</p>
				<a onClick={this.handleDeleteClick.bind(this)} href='#' className='link'>Sure?</a>
			</div>
		);
	}

	reactivateForm() {
		this.setState({ saveResponseStatus: undefined });
	}

	componentDidMount() {
		if(!this.state.model) {
			this.fetchModel();
		}
	}

	getResourceName() {
		return `${this.state.model ? this.state.model.name : 'item'}`;
	}

	fetchModel() {
		if (!this.props.params) { return; }
		var id = this.props.params.id;
		var model = new project.Model({ id: id });
		model.getClientFetchPromise({ id: id }).then((model) => {
			this.setState({ model: model });
		});
	}

	handleDeleteClick(e) {
		e.preventDefault();
		this.deleteModel();
	}

	deleteModel() {
		
		var model = this.state.model;

		this.setState({ saveResponseStatus: 'pending' });

		model.getClientDeletePromise().then((res) => {
			if (!_.isObject(res)) {
				res = JSON.parse(res);
			}
			console.log(res);
			this.setState({ saveResponseStatus: res.status });
		}, (err) => { 
			this.setState({ saveResponseStatus: 'error' });
		});

	}

}

Delete.contextTypes = {
	router: React.PropTypes.func
};

export default Delete;
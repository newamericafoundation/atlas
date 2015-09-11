import React from 'react';
import classNames from 'classnames';
import Static from './../../../general/static.jsx';
import Form from './../../../form/root.jsx';
import Loading from './../../../general/loading.jsx';

import { Link } from 'react-router';

import project from './../../../../models/project.js';

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
			</div>
		);
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
		if (!this.state.project) { return '/'; }
		return '/' + this.state.project.get('atlas_url');
	}

	renderPageNavContent() {
		return (
			<div>
				<p>I navigate the page!</p>
			</div>
		);
	}

	renderPageContent() {
		var bulk = this.state.project ? this.renderForm() : <Loading />
		return (
			<div className="static-content">
				{ bulk }
			</div>
		);
	}

	renderForm() {
		var isFormEnabled = (this.state.saveResponseStatus == null);
		return (
			<Form 
				model={ this.state.project }
				isEnabled={ isFormEnabled }
				submitButtonText="Edit Project" 
			/>
		);
	}

	componentDidMount() {
		if(!this.state.project) {
			this.fetchProject();
		}
	}

	fetchProject() {
		if (!this.props.params) { return; }
		var id = this.props.params.id;
		var model = new project.Model({ id: id });
		model.getClientFetchPromise({ id: id }).then((model) => {
			this.setState({ project: model });
		});
	}

}

Edit.contextTypes = {
	router: React.PropTypes.func
};

export default Edit;
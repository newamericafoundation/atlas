import React from 'react';
import classNames from 'classnames';
import Static from './../../../general/static.jsx';
import Form from './../../../form/root.jsx';

import project from './../../../../models/project.js';

class New extends Static {

	constructor(props) {
		super(props);
		this.state = {};
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
			</div>
		);
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
				<p>I navigate the page!</p>
			</div>
		);
	}

	renderPageContent() {
		return (
			<div className="static-content">
				<Form 
					model={ this.state.model } 
					submitButtonText="Create Project"
					onSubmit={ this.logFormData.bind(this) }
				/>
			</div>
		);
	}
	
	logFormData(formData) {
		this.state.model.getClientSavePromise().then((res) => {
			console.log(res);
		}, (err) => { console.log(err); });
	}

}

export default New;
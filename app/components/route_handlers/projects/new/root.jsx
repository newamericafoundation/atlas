import React from 'react';
import classNames from 'classnames';
import Static from './../../../general/static.jsx';
import Form from './../../../form/root.jsx';

import project from './../../../../models/project.js';

class New extends Static {

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
					model={ new project.Model() } 
					submitButtonText="Create Project"
					onSubmit={ this.logFormData.bind(this) }
				/>
			</div>
		);
	}
	
	logFormData(formData) {
		console.log(formData);
	}

}

export default New;
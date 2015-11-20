import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

import * as colors from './../../../../utilities/colors.js'
import * as Icons from './../../../../general/icons.jsx'

import Project from './project.jsx'


/*
 *
 *
 */
class Projects extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayImage: false,
			hasDisplayedImage: false
		};
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className="atl__projects">
				{ this.renderList() }
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderList() {
		var projects = this.props.projects;
		if (projects == null) { return; }
		return projects.map((project, i) => {
			return (
				<Project 
					{...this.props} 
					key={i}
					project={project}
					shouldDisplayImage={this.state.shouldDisplayImage}
				/>
			);
		});
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		var projects = this.props.projects;
		if (projects == null) { return; }
		this.ensureProjectImages();
	}


	/*
	 *
	 *
	 */
	ensureProjectImages() {
		var projects = this.props.projects;
		if (projects == null) { return; }
		if (this.state.hasDisplayedImage) { return; }
		if (projects.hasImages) {
			return this.setState({ shouldDisplayImage: true, hasDisplayedImage: true });
		}

		$.ajax({
			url: 'api/v1/projects?fields=atlas_url,encoded_image,image_credit',
			type: 'get',
			success: (data) => {
				// filter projects that don't have an image.
				var dataWithImage = [];
				data.forEach((datum) => {
					var project;
					if (datum.encoded_image != null) {
						project = projects.findWhere({ atlas_url: datum.atlas_url });
						project.set('encoded_image', datum.encoded_image);
						project.set('image_credit', datum.image_credit);
					}
				});
				projects.hasImages = true;
				this.setState({ shouldDisplayImage: true, hasDisplayedImage: true });
			}
		});
	}

}

export default Projects
import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

import * as colors from './../../../../../utilities/colors.js'
import * as Icons from './../../../../general/icons.jsx'

import Loader from './../../../../general/loader.jsx'

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
			hasProjectImages: false,
			shouldDisplayProjectImages: false
		}
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
		var { projects } = this.props
		var { hasProjectImages, shouldDisplayProjectImages } = this.state
		if (!projects) { return <Loader /> }
		return projects.map((project, i) => {
			return (
				<Project 
					{...this.props} 
					key={i}
					project={project}
					shouldDisplayImage={ hasProjectImages && shouldDisplayProjectImages }
				/>
			)
		})
	}


	/*
	 * Delay displaying images so that page renders faster.
	 *
	 */
	componentDidMount() {
		setTimeout(() => {
			this.setState({ shouldDisplayProjectImages: true })
		}, 250)
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		var { projects } = this.props
		if (projects) { this.ensureProjectImages() }
	}


	/*
	 *
	 *
	 */
	ensureProjectImages() {

		var { projects } = this.props
		if (!projects) { return }

		if (this.state.hasProjectImages) { return }

		$.ajax({
			url: '/api/v1/projects?fields=atlas_url,encoded_image,image_credit',
			type: 'get',
			success: (data) => {
				// filter projects that don't have an image.
				var dataWithImage = []
				data.forEach((datum) => {
					var { encoded_image, image_credit, atlas_url } = datum
					if (encoded_image != null) {
						let project = projects.findWhere({ atlas_url: atlas_url })
						project.set('encoded_image', encoded_image)
						project.set('image_credit', image_credit)
					}
				})
				this.setState({ hasProjectImages: true })
			}
		})
	}

}

export default Projects
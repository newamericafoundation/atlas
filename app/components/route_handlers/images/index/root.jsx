import React from 'react';
import Static from './../../../general/static.jsx';
import { Link } from 'react-router';

import image from './../../../../models/image.js';

class Index extends Static {

	constructor(props) {
		super(props);
		this.state = {
			scrollTop: 0,
			images: 0
		};
	}

	getTitleBarType() {
		return 'solid';
	}

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>All Images</h1>
			</div>
		);
	}

	renderPageContent() {
		return (
			<div>
				<p>All images.</p>
				{ this.state.images ? this.renderImages() : null } 
			</div>
		);
	}

	renderImages() {
		return this.state.images.map((image, i) => {
			return (
				<Link to={image.getEditUrl()} className='feature-box' style={{ margin: '20px', display: 'inline-block' }}>
					<div className='feature-box__top-content'>
						<p>{ image.get('name') }</p>
					</div>
					
				</Link>
			);
		});
	}

	fetchImages() {
		new image.Collection().getClientFetchPromise().then((coll) => {
			this.setState({ images: coll });
		});
	}

	componentDidMount() {
		this.fetchImages();
	}

}

Index.contextTypes = {
	router: React.PropTypes.func
};

export default Index;
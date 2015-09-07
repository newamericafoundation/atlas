import React from 'react';
import classNames from 'classnames';

class Static extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			scrollTop: 0
		};
	}

	render() {
		return (
			<div className='atl__main'>
				{ this.renderTitleBar() }
				{ this.renderContentBar() }
			</div>
		);
	}

	renderTitleBar(state) {
		var cls = classNames({
			'atl__title-bar': true,
			'atl__title-bar--image': (state === 'image'),
			'atl__title-bar--solid': (state === 'solid')
		});
		return (
			<div className={ cls } ref='title-bar'>
				<div className="atl__title-bar__background" ref='title-bar-background' />
				{ this.renderTitleBarContent() }
			</div>			
		);
	}

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>{ this.getTitle() }</h1>
				<ul>
					{ this.renderWebsite() }
				</ul>
			</div>
		);
	}

	renderContentBar() {
		return (
			<div className="atl__content-bar bg-c-off-white">
				<div className="atl-grid">
					<div className="atl-grid__1-3">
						{ this.renderPageNav() }
						
					</div>
					<div className="atl-grid__2-3">
						{ this.renderPageContent() }
					</div>
					<div className="atl-grid__3-3">
					</div>
				</div>
			</div>
		);
	}

	renderPageNav() {
		var cls = classNames({
			'atl__page-nav': true,
			'atl__page-nav--fixed': (this.state.scrollTop > 300)
		});
		return (
			<div className={ cls } ref="page-nav">
				{ this.renderPageNavContent() }		
			</div>
		);
	}

	renderPageNavContent() {

	}

	setStickyPageNav(e) {
		// console.log('setting state to ' + e.target.scrollTop);
		this.setState({ scrollTop: e.target.scrollTop });
	}

}

export default Static;
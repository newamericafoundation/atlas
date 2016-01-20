import React from 'react'
import classNames from 'classnames'

/*
 * This a base class and example setup for a standard, static page.
 * It has several sub-render methods that can be overridden on the subclass, or left along on the superclass.
 */
class Static extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.setStickyPageNav = this.setStickyPageNav.bind(this)
		// Make sure there is a scrollTop state value on the subclass.
		// Otherwise, setting sticky page layout will not work.
		this.state = { 
			scrollTop: 0
		}
	}


	/*
	 *
	 *
	 */
	render() {
		var style = { 'overflowY': 'scroll' }
		return (
			<div className='atl__main' style={style} onScroll={ this.setStickyPageNav }>
				{ this.renderTitleBar(this.getTitleBarType()) }
				{ this.renderContentBar() }
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderTitleBar(state) {
		var cls = classNames({
			'atl__title-bar': true,
			'atl__title-bar--image': (state === 'image'),
			'atl__title-bar--solid': (state === 'solid')
		})
		return (
			<div className={ cls } ref='title-bar'>
				{ this.renderTitleBarBackground() }
				{ this.renderTitleBarContent() }
			</div>			
		)
	}


	/*
	 *
	 *
	 */
	renderTitleBarBackground() {
		var color = this.props.radio ? this.props.radio.currentThemeColor : '#2dbbb3'
		return (
			<div 
				className="atl__title-bar__background" 
				ref='title-bar__background' 
				style={{backgroundColor: color}} 
			/>
		)
	}


	/*
	 *
	 *
	 */
	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>{ this.getTitle() }</h1>
				<ul>
					{ this.renderWebsite() }
				</ul>
			</div>
		)
	}


	/*
	 *
	 *
	 */
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
		)
	}


	/*
	 *
	 *
	 */
	renderPageNav() {
		var cls = classNames({
			'atl__page-nav': true,
			'atl__page-nav--fixed': (this.state.scrollTop > 300)
		})
		return (
			<div className={ cls } ref="page-nav">
				{ this.renderPageNavContent() }		
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderPageNavContent() {
		return (
			<p>Page Nav Content</p>
		)
	}


	/*
	 *
	 *
	 */
	renderPageContent() {
		return (
			<p>Page Content</p>
		)
	}


	/*
	 * This method should not be overridden on the subclass in order to keep sticky page nav logic DRY.
	 *
	 */
	setStickyPageNav(e) {
		this.setState({ scrollTop: e.target.scrollTop })
	}

}

export default Static
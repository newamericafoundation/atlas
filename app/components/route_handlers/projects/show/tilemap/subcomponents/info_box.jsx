import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import marked from 'marked'

import Static from './../../../../../general/static.jsx'
import * as Icons from './../../../../../general/icons.jsx'

import { image } from './../../../../../../models/index.js'

import Base from './base.jsx'


/*
 *
 *
 */
class InfoBox extends Static {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.state = {
			transitionEventNamespace: 0
		}
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className="atl__info-box" ref='main' onScroll={ this.setStickyPageNav.bind(this) }>
				<a href="#" className="atl__info-box__close" onClick={ this.close.bind(this) }>
					<Icons.No />
				</a>
				{ this.renderTitleBar('image') }
				{ this.renderContentBar() }
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderTitleBarBackground() {
		return (
			<div 
				className="atl__title-bar__background" 
				style={ this.getTitleBarBackgroundStyle() } 
				ref='title-bar-background' 
			/>
		)
	}


	/*
	 *
	 *
	 */
	getTitleBarBackgroundStyle() {

		var { project } = this.props
		var activeItem = project.get('data').items.active
		
		if (!activeItem) {
			if (project.getImageUrl()) {
				return { 'backgroundImage': project.getImageUrl() }
			}
			return { 'backgroundColor': 'rgba(50, 50, 50, 0.1)' }
		}

		// The image field is set to 'not available' if there was already a network request for the image and it returned empty.
		if (activeItem.image && activeItem.image !== 'not available') { 
			return { 'backgroundImage': activeItem.image.getUrl() }
		}

		return { 'backgroundColor': 'rgba(50, 50, 50, 0.1)' }
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
					{ this.renderWebsiteLink() }
				</ul>
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderPageNavContent() {
		// Render empty because of positioning bug.
		return;
		return (
			<div className="atl__toc">
				<p>Page Contents</p>
				<div id="atl__toc__list">
					{ this.renderTocList() }
				</div>
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderPageContent() {
		var content = this.getContent()
		return (
			<div 
				className='static-content' 
				dangerouslySetInnerHTML={{ __html: content.body }}
			/>
		)
	}


	/*
  	 * 
  	 *
  	 */
	renderTocList() {
		var tocItems = this.getContent().toc
		if (!tocItems) { return }
		if (tocItems.length < 2) { return }
		return tocItems.map((item, i) => {
			return (
				<li className={'toc-'+item.tagName} key={'toc-' + i}>
					<a href={"#toc-"+item.id}>
						{ item.content }
					</a>
				</li>
			)
		})
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		this.setImage()
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		var { project} = this.props
		var activeItem = project.get('data').items.active
		var { image } = this.state
		if (!image) { return this.setImage() }
		if (!activeItem || activeItem.getImageName() !== image.get('name')) {
			this.setImage()
		}
	}


	/*
	 *
	 *
	 */
	getTitle() {
		var { project } = this.props
		var activeItem = project.get('data').items.active
		if (activeItem) { return activeItem.get('name') }
		return project.get('title')
	}


	/*
	 *
	 *
	 */
	getBodyHtml() {
		var { project } = this.props
		var activeItem = project.get('data').items.active
		if (activeItem) {
			return '<p>Active Data Html</p>'
		}
		return project.get('body_text')
	}


	/*
	 *
	 *
	 */
	close(e) {
		var { radio } = this.props
		var $el, transitionEventName, items
		items = this.props.project.get('data').items
		e.preventDefault()
		transitionEventName = this.getTransitionEventName()
		$el = $(ReactDOM.findDOMNode(this.refs.main))
		$el.on(transitionEventName, () => {
			delete items.active
			$el.off(transitionEventName)
			radio.commands.execute('set:header:strip:color', {})
			radio.commands.execute('update:tilemap')
		})
		this.props.setUiState({ isInfoBoxActive: false })
	}


	/*
	 * Get a list of transition event names.
	 * Each event is namespaced with an incremental id so that the same events are not reattached over and over again.
	 */
	getTransitionEventName() {
		var eventName
		const events = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend']
		var { transitionEventNamespace } = this.state
		transitionEventNamespace += 1
		this.setState({
			transitionEventNamespace: transitionEventNamespace
		});
		eventName = events.map((evnt) => {
			return (evnt + "." + transitionEventNamespace)
		}).join(' ')
		return eventName
	}


	/*
	 * Fetch image related to the current active item.
	 *
	 */
	setImage() {

		var { project } = this.props
		var activeItem = project.get('data').items.active

		if (!activeItem) { return }
		
		if (!activeItem.image) {
			let imageName = activeItem.getImageName()
			let coll = new image.Collection()
			coll.getClientFetchPromise({ name: imageName })
				.then((coll) => {
					var img = coll.models[0]
					if (img) {
						activeItem.image = img
						this.forceUpdate()
					} else {
						activeItem.image = 'not available'
					}
				}).catch((err) => { console.log(err.stack) })
		}

	}


	/*
	 * 
	 *
	 */
	renderWebsiteLink() {
		var { project } = this.props
		if (!project) { return }
		var activeItem = project.get('data').items.active
		if (!activeItem) { return }
		var url = activeItem.get('website') || activeItem.get('state_website')
		if (!url) { return }
		return (
			<li>
				<a className="icon-button" href={url}>
					<div className="icon-button__icon">
						<Icons.Link />
					</div>
					<div className="icon-button__text">Website</div>
				</a>
			</li>
		)
	}


	/*
	 * Get info box body and table of contents.
	 *
	 */
	getContent() {

		var content = { body: '', toc: '' }
		var { project, activeItem } = this.props

		if (activeItem) {
			this.ensureActiveItemContent()
			content.body = activeItem.get('info_box_content')
			content.toc = activeItem.get('info_box_content_toc')
		} else {
			content.body = project.get('body_text')
			content.toc = project.get('body_text_toc')
		}

		return content

  	}


  	/*
  	 *
  	 *
  	 */
	getFilteredVariables(field) {

		var { project } = this.props
		var { variables } = project.get('data')
		var filtered

		filtered = variables.filter((variable) => {
			return !!variable.get(field)
		})

		filtered = filtered.sort(function(a, b) {
			return (a.get(field) - b.get(field))
		})

		return filtered

	}


	/*
	 *
	 *
	 */
	getSummaryContent() {

		var html, summaryVar

		var { activeItem } = this.props

		if (activeItem.get('summary') || activeItem.get('summarytable')) { return }

		summaryVar = this.getFilteredVariables('summary_order')

		if (summaryVar.length === 0) { return }

		html = '<table>'

		summaryVar.forEach((variable) => {
			html += `
				<tr>
					<td>
						${variable.get('display_title')}
					</td>
					<td>
						${variable.getFormattedField(activeItem)}
					</td>
				</tr>
			`
		})

		html += '</table>'

		return html

	}


	/*
	 *
	 *
	 */
	ensureActiveItemContent() {

		var { radio } = this.props
		var html, infoBoxVar, variables

		var { project } = this.props
		var { activeItem } = this.props

		var summaryContent = this.getSummaryContent()

		html = summaryContent ? `<h1>Overview</h1>${summaryContent}` : ''

		if (!activeItem) { return }
		if (activeItem.get('info_box_content')) { return }

		infoBoxVar = this.getFilteredVariables('infobox_order')

		infoBoxVar.forEach((variable) => {
			html += `
				<h1>
					${variable.get('display_title') || 'Overview'}
				</h1>
				${variable.getFormattedField(activeItem)}
			`
		})

		activeItem.set('info_box_content', html)

		return activeItem.setHtmlToc('info_box_content')

	}

}

export default InfoBox
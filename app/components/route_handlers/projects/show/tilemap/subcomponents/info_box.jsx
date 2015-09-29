import React from 'react';
import classNames from 'classnames';
import Static from './../../../../../general/static.jsx';
import Icons from './../../../../../general/icons.jsx';

import image from './../../../../../../models/image.js';

class InfoBox extends Static {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			transitionEventNamespace: 0
		}
	}


	/*
	 *
	 *
	 */
	render() {
		var NoIcon = Icons.No;
		return (
			<div className="atl__info-box" ref='main' onScroll={ this.setStickyPageNav.bind(this) }>
				<a href="#" className="atl__info-box__close" onClick={ this.close.bind(this) }>
					<NoIcon />
				</a>
				{ this.renderTitleBar('image') }
				{ this.renderContentBar() }
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderTitleBarBackground() {
		var style = this.getTitleBarBackgroundStyle();
		return (
			<div className="atl__title-bar__background" style={style} ref='title-bar-background' />
		);
	}


	/*
	 *
	 *
	 */
	getTitleBarBackgroundStyle() {
		var project = this.props.project,
			img = this.state.image,
			imgUrl = img ? img.getUrl() : project.getImageUrl();
		var activeItem = project.get('data').items.active;
		
		if (activeItem && activeItem.image) { 
			return { 'backgroundImage': activeItem.image.getUrl() } 
		}
		if (project.getImageUrl()) { 
			return { 'backgroundImage': project.getImageUrl() };
		}
		return { 'backgroundColor': 'rgba(50, 50, 50, 0.1)' };
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
		);
	}


	/*
	 *
	 *
	 */
	renderPageNavContent() {
		return (
			<div className="atl__toc">
				<p>Page Contents</p>
				<div id="atl__toc__list">
					{ this.renderTocList() }
				</div>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderPageContent() {
		var content = this.getContent();
		return (
			<div className='static-content' dangerouslySetInnerHTML={{ __html: content.body }}></div>
		);
	}


	/*
  	 * 
  	 *
  	 */
	renderTocList() {
		var tocItems = this.getContent().toc;
		if (!tocItems) { return; }
		if (tocItems.length < 2) { return; }
		return tocItems.map((item, i) => {
			return (
				<li className={'toc-'+item.tagName} key={'toc-' + i}>
					<a href={"#toc-"+item.id}>
						{ item.content }
					</a>
				</li>
			);
		});
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		this.setImage();
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		var activeItem = (this.props.project) ? (this.props.project.get('data').items.active) : undefined;
		if (this.state.image == null) { return this.setImage(); }
		if (activeItem == null || activeItem.getImageName() !== this.state.image.get('name')) {
			this.setImage();
		}
	}


	/*
	 *
	 *
	 */
	getTitle() {
		var activeItem, project;
		project = this.props.project;
		activeItem = project.get('data').items.active;
		if (activeItem != null) { return activeItem.get('name'); }
		return project.get('title');
	}


	/*
	 *
	 *
	 */
	getBodyHtml() {
		var activeItem, project;
		project = this.props.project;
		activeItem = project.get('data').items.active;
		if (activeItem != null) {
			return '<p>Active Data Html</p>';
		}
		return project.get('body_text');
	}


	/*
	 *
	 *
	 */
	close(e) {
		var $el, App, transitionEventName, items;
		items = this.props.project.get('data').items;
		e.preventDefault();
		transitionEventName = this.getTransitionEventName();
		$el = $(React.findDOMNode(this.refs.main));
		$el.on(transitionEventName, () => {
			delete items.active;
			$el.off(transitionEventName);
			var App = this.props.App;
			if (!App) { return; }
			App.commands.execute('set:header:strip:color', {});
			App.commands.execute('update:tilemap');
		});
		this.props.setUiState({ isInfoBoxActive: false });
	}


	/*
	 * Get a list of transition event names.
	 * Each event is namespaced with an incremental id so that the same events are not reattached over and over again.
	 */
	getTransitionEventName() {
		var eventName, events;
		events = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend'];
		this.setState({
			transitionEventNamespace: this.state.transitionEventNamespace + 1
		});
		eventName = events.map((evnt) => {
			return (evnt + "." + this.state.transitionEventNamespace);
		}).join(' ');
		return eventName;
	}


	/*
	 * Fetch image related to the current active item.
	 *
	 */
	setImage() {

		var activeItem, imageName, project;

		project = this.props.project;
		if (!project) { return; }

		activeItem = project.get('data').items.active;
		if (!activeItem) { return; }
		
		if (!activeItem.image) {
			let imageName = activeItem.getImageName();
			console.log(imageName);
			let coll = new image.Collection();
			coll.getClientFetchPromise({ name: imageName })
				.then((coll) => {
					var img = coll.models[0];
					if (img) {
						activeItem.image = img;
						this.forceUpdate();
					}
				}
			);
		}

	}


	/*
	 * 
	 *
	 */
	renderWebsiteLink() {
		var LinkComp = Icons.Link;
		var project = this.props.project;
		if (!project) { return; }
		var activeItem = project.get('data').items.active;
		if (!activeItem) { return; }
		var url = activeItem.get('website') || activeItem.get('state_website');
		if (!url) { return; }
		return (
			<li>
				<a className="icon-button" href={url}>
					<div className="icon-button__icon">
						<LinkComp />
					</div>
					<div className="icon-button__text">Website</div>
				</a>
			</li>
		);
	}


	/*
	 * Get info box body and table of contents.
	 *
	 */
	getContent() {
		var activeItem, body, cntnt, project, toc;
		body = '';
		toc = '';
		project = this.props.project;
		activeItem = this.props.activeItem;
		if (activeItem != null) {
			this.ensureActiveItemContent();
			body = activeItem.get('info_box_content');
			toc = activeItem.get('info_box_content_toc');
		} else {
			body = project.get('body_text');
			toc = project.get('body_text_toc');
		}
		return cntnt = {
			body: body,
			toc: toc
		};
  	}


  	/*
  	 *
  	 *
  	 */
	getFilteredVariables(field) {

		var project = this.props.project,
			variables = project.get('data').variables,
			filtered;

		filtered = variables.filter((variable) => {
			return !!variable.get(field);
		});

		filtered = filtered.sort(function(a, b) {
			return (a.get(field) - b.get(field));
		});

		return filtered;

	}


	/*
	 *
	 *
	 */
	getSummaryContent() {

		var activeItem, html, summaryVar;

		activeItem = this.props.activeItem;

		if (activeItem.get('summary') || activeItem.get('summarytable')) { return; }

		summaryVar = this.getFilteredVariables('summary_order');

		if (summaryVar.length === 0) { return; }

		html = '<table>';

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
			`;
		});

		html += '</table>';

		return html;

	}


	/*
	 *
	 *
	 */
	ensureActiveItemContent() {

		var App, activeItem, html, infoBoxVar, project, variables;

		project = this.props.project;
		App = this.props.App;

		activeItem = this.props.activeItem;

		var summaryContent = this.getSummaryContent();
		html = summaryContent ? `<h1>Overview</h1>${summaryContent}` : '';

		if (!activeItem) { return; }
		if (activeItem.get('info_box_content')) { return; }

		infoBoxVar = this.getFilteredVariables('infobox_order');

		infoBoxVar.forEach((variable) => {
			html += `
				<h1>
					${variable.get('display_title') || 'Overview'}
				</h1>
				${variable.getFormattedField(activeItem)}
			`;
		});

		activeItem.set('info_box_content', html);

		return activeItem.setHtmlToc('info_box_content');

	}

}

export default InfoBox;
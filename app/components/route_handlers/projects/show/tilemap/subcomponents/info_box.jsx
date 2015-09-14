import React from 'react';
import classNames from 'classnames';
import Static from './../../../../../general/static.jsx';

import image from './../../../../../../models/image.js';

class InfoBox extends Static {

	constructor(props) {
		super(props);
		this.state.transitionEventNamespace = 0;
	}

	render() {
		return (
			<div className="atl__info-box" ref='main' onScroll={ this.setStickyPageNav.bind(this) }>
				<a href="#" className="bg-img-no--black atl__info-box__close" onClick={ this.close.bind(this) }></a>
				{ this.renderTitleBar('image') }
				{ this.renderContentBar() }
			</div>
		);
	}

	renderTitleBarBackground() {
		var style = this.getTitleBarBackgroundStyle();
		return (
			<div className="atl__title-bar__background" style={style} ref='title-bar-background' />
		);
	}

	getTitleBarBackgroundStyle() {
		var project = this.props.project,
			img = this.state.image,
			style;
		if (img) {
			// console.log(project.getImageUrl());
			// console.log(img.getUrl());
			style = {
				'backgroundImage': img.getUrl()
			};
		} else {
			style = {
				'backgroundColor': 'rgba(50, 50, 50, 0.1)'
			};
		}
		return style;
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

	renderPageContent() {
		var content = this.getContent();
		return (
			<div className='static-content' dangerouslySetInnerHTML={{ __html: content.body }}></div>
		);
	}

	componentDidMount() {
		this.setImage();
	}

	componentDidUpdate() {
		var activeItem = (this.props.project) ? (this.props.project.get('data').items.active) : undefined;
		if (this.state.image == null) { return this.setImage(); }
		if (activeItem == null || activeItem.getImageName() !== this.state.image.get('name')) {
			this.setImage();
		}
	}

	getTitle() {
		var activeItem, project;
		project = this.props.project;
		activeItem = project.get('data').items.active;
		if (activeItem != null) {
			return activeItem.get('name');
		}
		return project.get('title');
	}

	getBodyHtml() {
		var activeItem, project;
		project = this.props.project;
		activeItem = project.get('data').items.active;
		if (activeItem != null) {
			return '<p>Active Data Html</p>';
		}
		return project.get('body_text');
	}

	close(e) {
		var $el, App, transitionEventName;
		e.preventDefault();
		transitionEventName = this.getTransitionEventName();
		$el = $(React.findDOMNode(this.refs.main));
		$el.on(transitionEventName, () => {
			App.vent.trigger('item:deactivate');
			$el.off(transitionEventName);
		});
		this.props.setUiState({
			isInfoBoxActive: false
		});
		return App = this.props.App;
	}


	// Get a list of transition event names.
	// Each event is namespaced with an incremental id so that the same events are not reattached over and over again.
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

	setImage() {
		var activeItem, imageName, project,
			coll;

		project = this.props.project;
		if (project == null) { return; }

		activeItem = project.get('data').items.active;
		if (activeItem == null) { return; }
		
		imageName = activeItem.getImageName();

		if (imageName != null) {
			coll = new image.Collection();
			coll.getClientFetchPromise({ name: imageName })
				.then((coll) => {
					var img = coll.models[0];
					if (img != null) {
						this.setState({ image: img });
					}
				}
			);
		}
	}

	renderWebsite() {
		return (
			<li>
				<a className="icon-button" href="#" target="_blank">
					<div className="icon-button__icon bg-img-link--black"></div>
					<div className="icon-button__text">Website</div>
				</a>
			</li>
		);
	}

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

	renderTocList() {
		var renderedList, tocItems;
		tocItems = this.getContent().toc;
		if (!((tocItems != null) && (tocItems.map != null) && tocItems.length > 0)) { return; }
		return renderedList = tocItems.map((item, i) => {
			return (
				<li className={'toc-'+item.tagName} key={'toc-' + i}>
					<a href={"#toc-"+item.id}>
						{ item.content }
					</a>
				</li>
			);
		});
	}

	ensureActiveItemContent() {
		var App, activeItem, html, infoBoxVar, project, variables;
		project = this.props.project;
		App = this.props.App;
		activeItem = this.props.activeItem;
		if ((activeItem == null) || (activeItem.get('info_box_content') != null)) {
			return;
		}
		variables = project.get('data').variables;
		infoBoxVar = variables.filter(function(variable) {
			return variable.get('infobox_order') != null;
		});
		infoBoxVar.sort(function(a, b) {
			return a.get('infobox_order') > b.get('infobox_order');
		});
		html = "";
		infoBoxVar.forEach((function(_this) {
			return function(variable) {
			  return html += "<h1>" + (variable.get('display_title')) + "</h1>" + (variable.getFormattedField(activeItem));
			};
		})(this));
		activeItem.set('info_box_content', html);
		return activeItem.setHtmlToc('info_box_content');
	}

}

export default InfoBox;
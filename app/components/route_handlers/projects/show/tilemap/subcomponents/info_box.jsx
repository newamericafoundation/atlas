Comp.Projects.Show.Tilemap.InfoBox = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			transitionEventNamespace: 0
		};
	}

	render() {
		var content = this.getContent();
		return (
			<div className="atl__info-box" ref='main'>
				<a href="#" className="bg-img-no--black atl__info-box__close" onClick={ this.close.bind(this) }></a>
				<div className="atl__title-bar atl__title-bar--image bg-c-off-white">
					<div className="atl__title-bar__background"></div>
					<div className="atl__title-bar__content">
						<h1 className='title'>{ this.getTitle() }</h1>
						<ul>
							{ this.renderWebsite() }
						</ul>
					</div>
				</div>
				<div className="atl__content-bar bg-c-off-white">
					<div className="atl-grid">
						<div className="atl-grid__1-3">
							<div className="atl__page-nav">
								<div className="atl__toc">
									<p>Page Contents</p>
									<div id="atl__toc__list">
										{ this.renderTocList() }
									</div>
								</div>
								<div id="atl__related"></div>
							</div>
						</div>
						<div className="atl-grid__2-3">
							<div className='static-content' dangerouslySetInnerHTML={{ __html: content.body }}></div>
						</div>
						<div className="atl-grid__3-3">
						</div>
					</div>
				</div>
			</div>
		);

	}

	shouldComponentUpdate(nextProps) {
		return this.props.activeItem !== nextProps.activeItem;
	}

	componentDidUpdate() {
		var App;
		App = this.props.App;
		if (App != null) {
			return this.setImage();
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
		var $el, App, activeItem, imageName, img, project;
		$el = $('.atl__title-bar__background');
		$el.css('background-color', 'rgba(50, 50, 50, 0.1)');
		$el.css('background-image', '');
		project = this.props.project;
		App = this.props.App;
		activeItem = project.get('data').items.active;
		if (activeItem == null) { return; }
		imageName = activeItem.getImageName();
		if (imageName != null) {
			img = App.reqres.request('image:entity', {
				name: imageName
			});
			return img.on('sync', (function(_this) {
				return function() {
					var backgroundImageCss;
					backgroundImageCss = img.getBackgroundImageCss();
					if (backgroundImageCss != null) {
						$el.css('background-color', 'initial');
						return $el.css('background-image', backgroundImageCss);
					}
				};
				// @_appendImageAttribution(img.getAttributionHtml())
			})(this));
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
					<a href={"#toc-"+item.id} onClick={ this.triggerScrollAfterDelay.bind(this) } >
						{ item.content }
					</a>
				</li>
			);
		});
	}


	// When a table of contents item is clicked, the sticky scroll layout code is not invoked.
	//   To fix this, an extra scroll event is triggered after every click
	//   to make sure the new scroll position is reached.
	triggerScrollAfterDelay() {
		var App, fn;
		App = this.props.App;
		if (App == null) { return; }
		fn = function() { return App.vent.trigger('scroll'); };
		return setTimeout(fn, 75);
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
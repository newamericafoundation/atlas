(function(){

Comp.Projects.Show.Explainer = class extends React.Component {

	render() {
		return (
			<div className="atl__main fill-parent">
				<div className="atl__title-bar atl__title-bar--solid bg-c-off-white" ref='title-bar'>
					<div className="atl__title-bar__background" ref='title-bar__background'></div>
					<div className="atl__title-bar__content">
						<h1 className='title'>{ this.getTitle() }</h1>
						<ul>
							<li>Updated: { this.getUpdateMoment() }</li>
						</ul>
					</div>
				</div>
				<div className="atl__content-bar bg-c-off-white"> 
					<div className="atl-grid">
						<div className="atl-grid__1-3">
							<div className="atl__page-nav" ref="page-nav">
								{ this.renderToc() }
							</div>
						</div>
						<div className="atl-grid__2-3">
							<div className="static-content" dangerouslySetInnerHTML={{ __html: this.getBodyText() }}>
							</div>
							<Comp.Projects.Show.Explainer.Related related={this.props.related} />
						</div>
						<div className="atl-grid__3-3"></div>
					</div>
				</div>
			</div>
		);
	}

	renderToc() {
		return (
			<div className="atl__toc">
				<p>Page Contents</p>
				<div id="atl__toc__list">
					<ul>
						{ this.renderTocList() }
					</ul>
				</div>
			</div>
		);
	}

	renderTocList() {
		var tocItems = this.props.project.get('body_text_toc');
		if (tocItems == null || tocItems.length === 0) { return; }
		return tocItems.map((item, i) => {
			return (
				<li className={'toc-'+item.tagName} key={'toc-' + i}>
					<a href={"#toc-"+item.id} onClick={ this.triggerScrollAfterDelay.bind(this) } >
						{ item.content }
					</a>
				</li>
			);
		});
	}

	componentDidMount() {
		this.buildAtlasCharts();
		this.setStickyNavLayout();
		this.onScroll();
		this.setThemeColor();
	}

	componentWillUnmount() {
		this.destroyAtlasCharts();
		this.offScroll();
	}

	getTitle() {
		var project = this.props.project;
		return (project != null) ? (project.get('title')) : '';
	}

	getBodyText() {
		var project = this.props.project;
		return (project != null) ? (project.get('body_text')) : '';
	}

	getUpdateMoment() {
		if (moment == null) { return; }
		return moment(this.props.project.get('updated_at')).format("MMMM Do YYYY");
	}

	// When a table of contents item is clicked, the sticky scroll layout code is not invoked.
	//   To fix this, an extra scroll event is triggered after every click
	//   to make sure the new scroll position is reached.
	triggerScrollAfterDelay() {
		var App = this.props.App
		if (App == null) { return; }
		var fn = () => { App.vent.trigger('scroll') };
		setTimeout(fn, 75);
	}

	buildAtlasCharts() {
		if (ChartistHtml == null) { return; }
		this.chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'));
		this.chartManager.render();
	}

	destroyAtlasCharts() {
		if (this.chartManager != null) {
			this.chartManager.destroy();
			delete this.chartManager;
		}
	}

	setStickyNavLayout() {
		if ($ == null) { return; }
		// TODO - optimize title bar height check so it is not performed all the time
		var scrollTop = $('.atl__main').scrollTop();
		var className = "atl__page-nav";
		var $elem = $(React.findDOMNode(this.refs['page-nav']));
		if (scrollTop > this.getTitleBarHeight()) {
			$elem.addClass("#{className}--fixed");
		} else {
			$elem.removeClass("#{className}--fixed");
		}
	}

	// Get title bar height.
	getTitleBarHeight() {
		if (this._titleBarHeightCache && this._titleBarHeightCache > 0) {
			return this._titleBarHeightCache;
		}
		var $el = $(React.findDOMNode(this.refs['title-bar']));
		this._titleBarHeightCache = $el.height();
		return this._titleBarHeightCache;
	}

	onScroll() {
		var App = this.props.App;
		if (App == null) { return; }
		App.vent.on('scroll', this.setStickyNavLayout.bind(this));
	}

	offScroll() {
		var App = this.props.App;
		if (App == null) { return; }
		App.vent.off('scroll', this.setStickyNavLayout.bind(this));
	}

	setThemeColor() {
		var App = this.props.App;
		if (App == null) { return; }
		var $bg = $(React.findDOMNode(this.refs['title-bar__background']));
		var color = App.currentThemeColor;
		if (color != null) {
			$bg.css('background-color', color);
		}
	}

}


}());



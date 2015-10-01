import React from 'react';
import classNames from 'classnames';
import Static from './../../../../general/static.jsx';
import Related from './subcomponents/related.jsx';
import moment from 'moment';

class Explainer extends Static {

	getTitleBarType() {
		return 'solid';
	}

	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>{ this.getTitle() }</h1>
				<ul>
					<li>Updated: { this.getUpdateMoment() }</li>
				</ul>
			</div>
		);
	}

	renderPageNavContent() {
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

	renderPageContent() {
		return (
			<div>
				<div className="static-content" dangerouslySetInnerHTML={{ __html: this.getBodyText() }}>
				</div>
				<Related related={this.props.related} />
			</div>
		);
	}

	renderTocList() {
		var tocItems = this.props.project.get('body_text_toc');
		if (tocItems == null || tocItems.length === 0) { return; }
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

	componentDidMount() {
		this.buildAtlasCharts();
	}

	componentWillUnmount() {
		this.destroyAtlasCharts();
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

}

export default Explainer;

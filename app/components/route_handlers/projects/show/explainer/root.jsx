import React from 'react'
import classNames from 'classnames'
import moment from 'moment'

import Static from './../../../../general/static.jsx'
import RelatedList from './subcomponents/related_list.jsx'

/*
 *
 *
 */
class Explainer extends Static {

	/*
	 *
	 *
	 */
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


	/*
	 *
	 *
	 */
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


	/*
	 *
	 *
	 */
	renderPageContent() {
		return (
			<div>
				<div className="static-content" dangerouslySetInnerHTML={{ __html: this.getBodyText() }}>
				</div>
				<RelatedList related={this.props.related} />
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderTocList() {
		var tocItems = this.props.project.get('body_text_toc')
		if (tocItems == null || tocItems.length === 0) { return }
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


	getTitleBarType() { return 'solid' }


	/*
	 *
	 *
	 */
	componentDidMount() {
		this.buildAtlasCharts()
	}


	/*
	 *
	 *
	 */
	componentWillUnmount() {
		this.destroyAtlasCharts();
	}


	/*
	 *
	 *
	 */
	getTitle() {
		var { project } = this.props
		return (project) ? (project.get('title')) : ''
	}


	/*
	 *
	 *
	 */
	getBodyText() {
		var { project } = this.props
		return (project) ? (project.get('body_text')) : ''
	}

	getUpdateMoment() {
		return moment(this.props.project.get('updated_at')).format("MMMM Do YYYY")
	}

	buildAtlasCharts() {
		this.chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'))
		this.chartManager.render()
	}

	destroyAtlasCharts() {
		if (this.chartManager != null) {
			this.chartManager.destroy()
			delete this.chartManager
		}
	}

}

export default Explainer
import React from 'react'

export default class Base extends React.Component {
	render() {
		return <div></div>
	}

	getName() {
		var hoveredItem = this.getHoveredItem()
		if (!hoveredItem) { return '' }
		return hoveredItem.get('name')
	}

	getValue() {
		var hoveredItem = this.getHoveredItem()
		var filter = this.getFilter()
		var filterActiveChild = filter.getActiveChild()
		var variable
		if (!hoveredItem || !filter || !filterActiveChild) { return }
		variable = filter.getActiveChild().get('variable')
		return variable.getFormattedField(hoveredItem)
	}

	getKey() {
		var filter = this.getFilter()
		var filterActiveChild = filter.getActiveChild()
		if (!filterActiveChild) { return '' }
		return filterActiveChild.get('variable').get('display_title')
	}

	getHoveredItem() {
		return this.props.project.get('data').items.hovered
	}

	getFilter() {
		return this.props.project.get('data').filter
	}
}

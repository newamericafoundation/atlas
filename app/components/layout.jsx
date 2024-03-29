import React from 'react'
import { RoutingContext } from 'react-router'
import classNames from 'classnames'

import { connect } from 'react-redux'

import Setup from './general/setup/root.jsx'
import Header from './general/header.jsx'

import Backbone from 'backbone'
import Wreqr from 'backbone.wreqr'

function createRadio() {
	var radio = {}
	radio.vent = new Wreqr.EventAggregator()
	radio.reqres = new Wreqr.RequestResponse()
	radio.commands = new Wreqr.Commands()
	return radio
}

class Layout extends React.Component {

	constructor(props) {
		super(props)
		this.setUiDimensions = this.setUiDimensions.bind(this)
		this.state = { radio: createRadio() }
	}

	render() {
		var { authenticatedResearcher, ui } = this.props.app
		var { radio } = this.state
		return (
			<div className={this.getClassName()}>
				<Setup radio={radio} />
				<Header
					radio={radio}
					title={this.getHeaderTitle()}
					isTransparent={this.isHeaderTransparent()}
					authenticatedResearcher={authenticatedResearcher}
				/>
				{ this.renderFlash() }
				{ React.cloneElement(this.props.children, {
					radio: radio,
					authenticatedResearcher: authenticatedResearcher,
					routing: this.props.routing,
					app: this.props.app,
					dispatch: this.props.dispatch
				}) }
			</div>
		)
	}

	renderFlash() {
		var { flash } = this.props.app
		if (flash.length === 0) { return }
		return (
			<div className='flash'>
				{ flash }
			</div>
		)
	}

	componentDidMount() {
		this.setUiDimensions()
		$(window).on('resize', this.setUiDimensions)
	}

	setUiDimensions() {
		var dim = {
			width: $(window).width(),
			height: $(window).height()
		}
		this.props.dispatch({
			type: 'SET_UI_DIMENSIONS',
			data: dim
		})
	}

	// TODO: get route name to clean up this method.
	getClassName() {
		var { pathname } = this.props.location
		return classNames({
			'wrapper': true,
			'atl-route--welcome_index': (['/', '/welcome'].indexOf(pathname) > -1),
			'atl-route--projects_index': (['/menu'].indexOf(pathname) > -1),
			'atl-route--projects_show': (['/', '/welcome', '/menu'].indexOf(pathname) === -1)
		})
	}

	isHeaderTransparent() {
		var { pathname } = this.props.location
		if (['/', '/welcome'].indexOf(pathname) > -1) { return true }
		return false
	}

	getHeaderTitle() {
		var { pathname } = this.props.location
		if (['/', '/welcome'].indexOf(pathname) > -1) { return 'New America' }
		return 'Atlas'
	}

}

export default connect(state => ({
	routing: state.routing,
	app: state.app
}))(Layout)

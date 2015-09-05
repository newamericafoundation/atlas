import React form 'react';
import { Link } from 'react-router';

class SideBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isActive: false
		};
		this.props.buttons = this.props.buttons || defaultButtons;
	}

	render() {
		return (
			<div className={ this.getClass() } onClick={ this.toggle.bind(this) }>
				<div className="atl__side-bar__title">{ this.state['hoveredButtonTitle'] }</div>
				{ this.renderButtons() }
			</div>
		);
	}

	getClass() {
		return classNames({
			'atl__side-bar': true,
			'atl__side-bar--active': this.state['isActive']
		});
	}

	setHoveredButtonTitle(title) {
		this.setState({ hoveredButtonTitle: title });
	}

	toggle() {
		this.setState({ isActive: !this.state['isActive'] });
	}

	renderButtons() {
		if (this.props.buttons == null) { return; }
		var list = this.props.buttons.map((options, i) => {
			return (
				<SideBarButton 
					{...this.props}
					options={options}
					setHoveredButtonTitle={this.setHoveredButtonTitle.bind(this)}
					key={i}
				/>
			)
		});
		return (
			<ul className="atl__side-bar__icons">
				{list}
			</ul>
		);
	}

}

class SideBarButton extends React.Component {

	render() {
		return (
			<li className="atl__side-bar__icon" 
				onMouseEnter={ this.onButtonMouseEnter.bind(this) } 
				onMouseLeave={ this.onButtonMouseLeave.bind(this) } 
				onClick={ this.handleClick.bind(this) } 
			>
				{ this.renderContent() }
			</li>
		);
	}

	onButtonMouseEnter() {
		this.props.setHoveredButtonTitle(this.props.options.title);
	}

	onButtonMouseLeave() {
		this.props.setHoveredButtonTitle('');
	}

	renderContent() {
		var contentType = this.props.options.contentType;
		if (contentType === 'form') { return this.renderFormContent(); }
		if (contentType === 'inner-link') { return this.renderInnerLinkContent(); }
		if (contentType === 'outer-link') { return this.renderOuterLinkContent(); }
		return this.renderDefaultContent();
	}

	renderDefaultContent() {
		var IconComp = Comp.Icons[this.props.options.reactIconName];
		return (
			<div>
				<IconComp />
			</div>
		);
	}

	renderInnerLinkContent() {
		var IconComp = Comp.Icons[this.props.options.reactIconName];
		return (
			<Link to={ this.props.options.url }>
				<IconComp />
			</Link>
		);
	}

	renderOuterLinkContent() {
		var IconComp = Comp.Icons[this.props.options.reactIconName];
		return (
			<a href={ this.props.options.url }>
				<IconComp />
			</a>
		);
	}

	renderFormContent() {
		var IconComp = Comp.Icons[this.props.options.reactIconName];
		return ( 
			<form action={ this.props.options.url } method='post'> 
				<IconComp />
				<input type="hidden" name={ this.props.options.hiddenInputKey } value={ this.props.options.hiddenInputValue } />
				<input type="submit" value="" />
			</form>
		);
	}

	handleClick() {
		if (this[ '_' + this.props.options.method ] != null) {
			this[ '_' + this.props.options.method ]();
		}
	}		

	// Button press method.
	// 	Expand or collapse. To be renamed.
	_collapse(e) {
		if (this.props.setUiState != null) {
			this.props.setUiState({ isCollapsedMaster: !this.props.uiState.isCollapsedMaster });
		}
	}

	// Button press method.
	_help(e) {
		if ($ == null) { return; }
		$('.atl').toggleClass('atl--help');
	}

	// Button press method.
	_print(e) {
		window.print();
	}

}

export default SideBar;
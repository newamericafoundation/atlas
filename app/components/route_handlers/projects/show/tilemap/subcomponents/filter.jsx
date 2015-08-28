Comp.Projects.Show.Tilemap.Filter = class extends React.Component {

	constructor(props) {
		super(props);
		this.maxHeight = 0;
	}

	render() {
		var HelpComp = Comp.Help;
		return (
			<div className='atl__filter' ref='root'>
				<div className="atl__filter__keys">
					<ul>
						{ this.renderKeys() }
					</ul>
					<HelpComp position='right' text='Select the variable you want to filter by.' id='filter-keys' />
				</div>
				<div className="atl__filter__values">
					<ul>
						{ this.renderValues() }
					</ul>
					<HelpComp position='right' text='Select the values you want to filter out. Corresponding map colors are indicated.' id='filter-values' />
				</div>
			</div>
		);
	}

	getHeight() {
		var $el = $(React.findDOMNode(this.refs.root));
		var height = $el.height();
		if (height > this.maxHeight) { this.maxHeight = height; }
		else { height = this.maxHeight }
		return height;
	}

	componentDidUpdate() {
		this.props.cacheHeight(this.getHeight());
	}

	renderKeys() {
		var keys = this.props.filter.children,
			Cmp = Comp.Projects.Show.Tilemap.FilterKey;
		return keys.map((key, i) => {
			return (
				<Cmp App={this.props.App} filterKey={key} />
			);
		});
	}

	renderValues() {
		var values = this.props.filter.getActiveChild().children,
			Cmp = Comp.Projects.Show.Tilemap.FilterValue;
		return values.map((value, i) => {
			return (
				<Cmp App={this.props.App} filterValue={value} />
			);
		});
	}

}


Comp.Projects.Show.Tilemap.FilterKey = class extends React.Component {

	render() {
		return (
			<li className={ 'button ' + this.getModifierClass() } onClick={ this.toggle.bind(this) }>
				<p>
					{ this.props.filterKey.get('display_title') }
				</p>
			</li>
		);
	}

	getModifierClass() {
		if (this.props.filterKey.isActive()) {
			return 'button--active';
		}
		return '';
	}

	toggle() {
		var App = this.props.App;
		this.props.filterKey.clickToggle();
		if (App == null) { return; }
		App.commands.execute('update:tilemap');
	}

}


Comp.Projects.Show.Tilemap.FilterValue = class extends React.Component {

	render() {
		var IconComp = Comp.Icons.Hex;
		return (
			<li className={ 'toggle-button ' + this.getModifierClass() } onClick={ this.toggle.bind(this) } onMouseEnter={ this.setHovered.bind(this) } onMouseLeave={ this.clearHovered.bind(this) } >
				<IconComp className="toggle-button__icon" colorClassName={ this.getColorClass() } />
				<div className="toggle-button__text">
				   	<p>{ this.props.filterValue.get('value') }</p>
				</div>
			</li>
		);
	}

	getModifierClass() {
		var siblingsIncludingSelf = this.props.filterValue.parent.children
		if (!this.props.filterValue.isActive()) { return 'toggle-button--inactive'; }
		return '';
	}

	getColorClass() {
		return `bg-c-${ this.props.filterValue.getFriendlySiblingIndex(15) }`;
	}

	setHovered() {
		var App, modelIndex, cls;
		App = this.props.App;
		modelIndex = this.getFilterValueIndex();
		this.props.filterValue.parent.parent.state.valueHoverIndex = modelIndex;
		App.commands.execute('update:tilemap');
		cls = this.getColorClass();
		App.commands.execute('set:header:strip:color', { className: cls });
	}

	clearHovered() {
		var App;
		App = this.props.App;
		this.props.filterValue.parent.parent.state.valueHoverIndex = -1;
		App.commands.execute('update:tilemap');
		App.commands.execute('set:header:strip:color', 'none');
	}

	getFilterValueIndex() {
		return this.props.filterValue.parent.children.indexOf(this.props.filterValue);
	}

	toggle() {
		var App;
		this.props.filterValue.toggle();
		App = this.props.App;
		if (App == null) { return; }
		App.commands.execute('update:tilemap');
	}

}
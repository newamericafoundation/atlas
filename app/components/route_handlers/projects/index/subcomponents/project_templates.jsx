(function() {

Comp.Projects.Index.ProjectTemplates = class extends React.Component {

	render() {
		return (
			<ul className="atl__project-template-filter">
				{ this.renderList() }
			</ul>
		);
	}

	renderList() {
		if (this.props.projectTemplates == null) { return; }
		return this.props.projectTemplates.map((item, i) => {
			return (
				<ProjectTemplateItem App={this.props.App} projectTemplate={item} key={i} />
			);
		});
	}

}


class ProjectTemplateItem extends React.Component {
	
	render() {
		var projectTemplate = this.props.projectTemplate;
		return (
			<li className={ "icon-button " + this.getModifierClasses() } onClick={this.toggleActiveState.bind(this)} >
				<div className={ `icon-button__icon bg-img-${ this.getIcon() }--black` }></div>
				<p className="icon-button__text">
					{projectTemplate.get('display_name')}
				</p>
			</li>
		);
	}

	getModifierClasses() {
		var classes, projectTemplate;
		classes = [];
		projectTemplate = this.props.projectTemplate;
		if (projectTemplate.get('id') === '2') { classes.push('hidden'); }
		if (projectTemplate.get('_isActive')) { classes.push('icon-button--active');  }
		if (classes.length === 0) { return ''; }
		return classes.join(' ');
	}

	getIcon() {
		var templateName = this.props.projectTemplate.get('name'),
			dictionary = {
				'Tilemap': 'map',
				'Explainer': 'dictionary',
				'Polling': 'graph'
			};
		return dictionary[templateName];
	}

	toggleActiveState() {
		var App;
		this.props.projectTemplate.toggleActiveState();
		App = this.props.App;
		if (App == null) { return };
		App.vent.trigger('project:filter:change')
	}

}


}());
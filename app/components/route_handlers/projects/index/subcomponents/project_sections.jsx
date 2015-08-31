(function() {

Comp.Projects.Index.ProjectSections = class extends React.Component {

	render() {
		return (
			<ul className="atl__project-section-filter">
				{ this.renderList() }
			</ul>
		);
	}

	renderList() {
		if (this.props.projectSections == null) { return; }
		return this.props.projectSections.map((item, i) => {
			return (
				<ProjectSectionsItem App={this.props.App} projectSection={item} key={i} />
			);
		});

	}

}

class ProjectSectionsItem extends React.Component {

	render() {
		var projectSection = this.props.projectSection;
		return (
			<li className={ "toggle-button toggle-button--black " + this.getModifierClass() } onClick={ this.toggleActiveState.bind(this) }>
				<Comp.Icons.Hex className={'toggle-button__icon'} />
				<div className="toggle-button__text">
					<p>{projectSection.get('name')}</p>
				</div>
			</li>
		);

	}

	getModifierClass() {
		if(!this.props.projectSection.get('_isActive')) {
			return 'toggle-button--inactive';
		}
		return '';
	}

	toggleActiveState() {
		var App;
		this.props.projectSection.toggleActiveState();
		App = this.props.App;
		if (App != null) {
			App.vent.trigger('project:filter:change');
		}
	}

}

}());
export default function buttonsDataGenerator(project, isResearcherAuthenticated, isCollapsedDueToOverflow) {

	var atlas_url = (project) ? (project.get('atlas_url')) : '';
	var id = (project) ? (project.get('id')) : '';

	var publicButtons = [

		{ 
			title: 'Collapse/Expand',
			contentType: 'button',
			clickMessage: 'toggle-collapsed-state', 
			reactIconNames: [ 'Contract', 'Expand' ],
			isHidden: isCollapsedDueToOverflow
		},
		{ 
			title: 'Help',
			contentType: 'button',
			clickMessage: 'toggle-help', 
			reactIconNames: [ 'Help' ]
		},
		{ 
			title: 'Print',
			contentType: 'button',
			clickMessage: 'print',
			reactIconNames: [ 'Print' ]
		},
		{ 
			title: 'Download Data',
			contentType: 'form',
			hiddenInputKey: 'atlas_url',
			hiddenInputValue: atlas_url,
			url: '/api/v1/projects/print',
			reactIconNames: [ 'Download' ]
		},
		{ 
			title: 'Search',
			contentType: 'button',
			reactIconNames: [ 'Search' ],
			clickMessage: 'toggle-search-bar'
		}

	];

	var authButtons = [
		{
			title: 'Edit Project',
			contentType: 'inner-link',
			url: project ? project.getEditUrl() : '/',
			reactIconNames: [ 'Build' ]
		},
		{
			title: 'Delete Project',
			contentType: 'inner-link',
			url: project ? project.getDeleteUrl() : '/',
			reactIconNames: [ 'Trash' ]
		}
	];

	if (!isResearcherAuthenticated) { return publicButtons; }
	return publicButtons.concat(authButtons);

};
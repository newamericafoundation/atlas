export default function(project, isResearcherAuthenticated) {

	var atlas_url = (project) ? (project.get('atlas_url')) : '';
	var id = (project) ? (project.get('id')) : '';

	var publicButtons = [

		{ 
			title: 'Explore Atlas',
			contentType: 'inner-link',
			url: '/menu',
			reactIconName: 'Grid',
			isToggleable: false 
		},
		{ 
			title: 'Collapse/Expand',
			contentType: 'button',
			clickMessage: 'toggle-collapsed-state', 
			reactIconName: 'Contract', 
			activeReactIconName: 'Expand', 
			isToggleable: false 
		},
		{ 
			title: 'Help',
			contentType: 'button',
			clickMessage: 'toggle-help', 
			reactIconName: 'Help', 
			isToggleable: false 
		},
		{ 
			title: 'Print',
			contentType: 'button',
			clickMessage: 'print',
			reactIconName: 'Print', 
			isToggleable: false 
		},
		{ 
			title: 'Download Data',
			contentType: 'form',
			hiddenInputKey: 'atlas_url',
			hiddenInputValue: atlas_url,
			url: '/api/v1/projects/print',
			reactIconName: 'Download',
			isToggleable: false
		},
		{ 
			title: 'Search',
			contentType: 'button',
			reactIconName: 'Search',
			clickMessage: 'toggle-search-bar'
		}

	];

	var authButtons = [
		{
			title: 'Edit Project',
			contentType: 'inner-link',
			url: `/projects/${id}/edit`,
			reactIconName: 'Build'
		},
		{
			title: 'Delete Project',
			contentType: 'inner-link',
			url: `/projects/${id}/delete`,
			reactIconName: 'Trash'
		}
	];

	if (!isResearcherAuthenticated) { return publicButtons; }
	return publicButtons.concat(authButtons);

};
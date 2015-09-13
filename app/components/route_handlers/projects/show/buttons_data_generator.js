export default function(project, isResearcherAuthenticated) {

	var atlas_url = (project) ? (project.get('atlas_url')) : '';
	var id = (project) ? (project.get('id')) : '';

	var publicButtons = [

		{ 
			title: 'Explore Atlas',
			contentType: 'inner-link',
			url: '/menu',
			method: 'projects', 
			reactIconName: 'Grid',
			isToggleable: false 
		},
		{ 
			title: 'Collapse/Expand',
			contentType: 'button',
			method: 'collapse', 
			reactIconName: 'Contract', 
			activeReactIconName: 'Expand', 
			isToggleable: false 
		},
		{ 
			title: 'Help',
			contentType: 'button',
			method: 'help', 
			reactIconName: 'Help', 
			isToggleable: false 
		},
		{ 
			title: 'Print',
			contentType: 'button',
			method: 'print', 
			reactIconName: 'Print', 
			isToggleable: false 
		},
		{ 
			title: 'Download Data',
			contentType: 'form',
			hiddenInputKey: 'atlas_url',
			hiddenInputValue: atlas_url,
			url: '/api/v1/projects/print',
			method: 'download',
			reactIconName: 'Download',
			isToggleable: false
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
			contentType: 'button',
			clickMessage: 'delete-project',
			reactIconName: 'Shipping'
		}
	];

	if (!isResearcherAuthenticated) { return publicButtons; }
	return publicButtons.concat(authButtons);

};
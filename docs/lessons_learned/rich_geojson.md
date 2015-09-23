This is a typical server response to be displayed:

	{
		state: ‘California’,
		ed_data_1: ‘d1’,
		ed_data_2: ‘d2’,
		ed_data_3: ‘d3’
	}

Backbone turns this into the following:

	model = {
		id: 1,
		attributes: {
			state: ‘California’,
			ed_data_1: ‘d1’,
			ed_data_2: ‘d2’,
			ed_data_3: ‘d3’
		},

		// ** Backbone Utility Methods **
		toJSON, parse, fetch, on, listenTo, destroy, change, validate

		// ** Custom Methods **
		// get coloring based on the filter model
		getColorCode: function(filterModel, legendModel) { /* */ }
	}

Whereas d3 would like the following:

	geoJson = topoJson.feature(data, data.objects.states)

	geoJson = {
		type: ‘FeatureCollection’,
		features: [
			{
				properties: {},
				geometry: {}
			}
		]
	}


Luckily, it will also happily accept this:

	richGeoJson = {
		type: ‘FeatureCollection’,
		features: [
			{
				_model: model,
				geometry: {}
			}
		]
	}


So later on:

	d3.selectAll(‘path’)
		.on(‘click’, function(d) {
			var model = d._model;
			// I am reunited with my model
	})

Making this happen: once TopoJson is loaded from the server, model references are ‘injected’ into it. Doing this only once in the beginning speeds up further interactions.

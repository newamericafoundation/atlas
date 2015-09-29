Atlas' data api allows flexible interaction with the database using JSON.

# Api Call Structure

The general rule, written in ES6 interpolation terms and broken up into multiple lines, is the following:

	/api/v1/${resourceName}
		?
		${queryFieldKey1}=${queryFieldValue1}
		&
		{queryFieldKey2}=${queryFieldValue2}
		&
		...
		...
		&
		fields=${field_1},${field_2},${field_3}
		&
		special_query_params=${special_query_param_1},${special_query_param_2}

A couple of examples:

Fetch all projects, including all fields present in the database:

	/api/v1/projects

Fetch all projects, querying a single field (returns an array):

	/api/v1/projects?atlas_url=mapping-college-readiness

Fetch all projects, including only the ``title`` and the ``author`` fields:

	/api/v1/projects?fields=title,author

Fetch all projects, excluding the ``data`` and ``encoded_image`` fields:

	/api/v1/projects?fields=-data,-encoded_image

Fetch all projects from the database, but apply a filtering method ``related_to`` implemented on the project model before sending response to the client:

	/api/v1/projects?special_query_params=related_to&related_to=123

# Api Call Options Docs

## Fields

## Special Query Params
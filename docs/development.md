# Getting Started

Once you clone the repository, run the following two commands to install dependencies locally:

	npm install
	bower install

New America sites have been severely hacked before, so the following method of using secret keys and api tokens in development mode are crucial. Create a folder called ``secrets`` directly outside the project folder, so that they are siblings:

	secrets
		atlas.json
	atlas
		app
		config
		db
		app.js
		bower.json
		package.json
		README.md

Create a ``secrets/atlas.json`` file containing the secret environment variables. See [the environment docs](/environment.md) for details.

Once this file is up, you can run a fully featured development environment by simply typing:

	gulp dev

Then navigate to ``localhost:8081``. This command automatically reads in the secret environment variables from ``./../secrets/atlas.json`` so the app will work seamlessly in development mode. Note that ``NODE_ENV=development`` is set explicitly. 

Gulp will watch for changes in development scripts and styles automatically (see build logic in the ``gulpfile``).

In development mode, the app behaves as if a researcher is always authenticated.

# Development Database

The development database defaults to localhost:27017 as set in ``./url_config.json``. When Atlas is run locally, this is set automatically.
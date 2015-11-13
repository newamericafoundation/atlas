# Getting Started

Once you clone the repository, run the following two commands to install dependencies locally:

	npm install
	bower install

New America sites have been severely hacked before, so the following method of using secret keys and api tokens in development mode are crucial. You will need to recreate the ``.env`` file that stores environment variables for development mode (loaded automatically by the ``dotenv`` project), as this is ignored by gitignore. See [the environment docs](/environment.md) for details.

	atlas
		.env
		app
		config
		db
		app.js
		bower.json
		package.json
		README.md

Once this file is up, you can run a fully featured development environment by simply typing:

	gulp dev

Gulp will watch for changes in development scripts and styles automatically (see build logic in the ``gulpfile``).

In development mode, the app behaves as if a researcher is always authenticated (write permissions on projects and images are enabled).

# Development Database

The development database defaults to localhost:27017 as set in ``./url_config.json``. When Atlas is run locally, this is set automatically.
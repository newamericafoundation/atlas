Once you clone the repository, run the following two commands to install dependencies locally:

	npm install
	bower install

Next, create a folder called ``secrets`` directly outside the project folder, so that they are siblings (this prevents accidental commits to the repository). Make sure the folder contains an ``atlas.json`` file containing the secret environment variables. Currently, these are the following:

	GOOGLE_CLIENT_ID
	GOOGLE_CLIENT_SECRET
	PRERENDER_TOKEN
	PRODUCTION_DB_URL

Run development environment by typing:

	gulp dev

Then navigate to ``localhost:8081``. This command automatically reads in the secret environment variables from ``./../secrets/atlas.json`` so the app will work seamlessly in development mode. Note that ``NODE_ENV=development`` is set explicitly. Gulp will also watch for changes in development scripts and styles automatically (see build logic in the ``gulpfile``).

In development mode, the app behaves as if a researcher is always authenticated.

### Development Database

The development database defaults to localhost:27017 as set in ``./url_config.json``. When Atlas is run locally, this is set automatically.
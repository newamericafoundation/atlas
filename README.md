# Atlas

Policy analysis tool for New America's Education Policy Program.

## General Information

Url: http://atlas.newamerica.org/
Related Url: http://build.atlas.newamerica.org/

Server: ``node.js v0.12.2``.
Client: ``React.js``, ``react-router``.
Build: ``gulp.js``.
Authentication: ``passport.js`` with ``passport-google-oauth``.
Database: ``MongoDB``.

## Development Environment

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

Then navigate to ``localhost:8081``. This command automatically reads in the secret environment variables from ``./../secrets/atlas.json`` so the app will work in development mode. It will also watch for changes in development scripts and styles automatically (see build logic in the ``gulpfile``).

### Development Database

The development database defaults to localhost:27017 as set in ``./url_config.json``. When Atlas is run locally, this is set automatically.

## Testing Environment

Client- and server-side specs are run with the following commands:

	gulp spec

## Production Environment

Atlas can be deployed by simply typing:

	gulp deploy

This will automatically compile production assets (minified for css, minified + gzipped for js), commit the changes with a standard commit message and deploy to the production server.

The ``.ebextensions`` folder supplies the configuration settings that ensure Atlas can be correctly load balanced and connected to the database. An important part of this is deploying within a VPC, if the database instance was deployed inside a VPC also. This will ensure that MongoDB ports can be opened between the database instance and all Elastic Beanstalk instances, as they launch and close on demand.

## Production Database

The production database is set in the environment under the key ``PRODUCTION_DB_URL``. Atlas connects to this database automatically in production mode, distinguishing between dev and production databases by reading environment variables. The environment is set to production in an eb extension (see below).

## Folder Structure and Naming

Main entry point: ``./app.js``.

Main folder structure:
* ``./app`` - models, views, components, routes, middleware and assets in development.
* ``./config`` - general app configuration.
* ``./db`` - database-related code and content. Includes seeds, the database connector and batch database update utilities.
* ``./public`` - public data, including precompiled assets and images.
* ``./spec`` - specs.
* ``./gulp_tasks`` - build tasks referenced from ``./gulpfile.js``.

Additional files:
* ``bower.json`` - client-side dependencies.
* ``package.json`` - package definition and server-side dependencies.

To allow code-sharing between server and client, models and components are written on the server and bundled to the client.
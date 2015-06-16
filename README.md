Atlas

# Development Environment

Atlas is currently deployed on Node version 0.12.2.

	npm install
	bower install

Run development environment by simply typing:

	gulp dev

This will automatically watch for changes in development scripts and styles (see file types in gulpfile).

## Development Database

The development database defaults to localhost:27017 as set in ./atlas_config.json. When Atlas is run locally, this is set automatically.

# Testing Environment

Client- and server-side scripts are run with the following commands:

	gulp spec
	gulp spec-server

There is not separate test database.

# Production Environment

Atlas can be deployed by simply typing:

	gulp deploy

This will automatically compile production assets (minified for css, minified + gzipped for js), commit the changes with a standard commit message and deploy the production server.

## Production Database

The production database is set in ./atlas_config.json. Atlas connects to this database automatically in production mode, distinguishing between dev and production databases by reading environment variables. The environment is set to production in an eb extension (see below).

## Elastic Beanstalk

# Todo List

* add Shutterstock credits to photos.
* implement template helper methods to break down long words in filter value texts.
* inspect iPhone 6 crash.
* project section overviews can share the title bar image and their listings page image.
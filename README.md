# Atlas

Policy analysis tool for New America's Education Policy Program.

Url: http://atlas.newamerica.org/welcome
Related Url: http://build.atlas.newamerica.org/

## App Structure and Basics

Main entry point: ``./app.js``.

Main folder structure:
* ``./app`` - models, views, routes and assets in development.
* ``./config`` - configuration variables.
* ``./db`` - database ``/seeds`` and batch database update ``/utilities``.
* ``./public`` - public data.
* ``./spec`` - specs for client- and server-side code.

Additional files:
* ``bower.json`` - client-side dependencies.
* ``package.json`` - package definition and server-side dependencies.
* ``gulpfile.js`` - build scripts.

### File Naming Conventions

To allow code-sharing between server and client, models and components are written on one side and compiled to the other. Files and folders prefixed by ``__auto__`` are generated automatically and should not be touched. Files prefixed by ``__client__`` define the way server-side code is rendered on the server (browserify entry point).

### Subfolders

#### ``./app/assets/scripts/atlas``

Holds main client-side scripts. All single-page application code is contained within this folder, structured in ``Marionette.js`` modules except for the ``/components`` directory. This component holds React components that are currently replacing Backbone Views.

## Development Environment

Atlas is currently deployed on Node version 0.12.2 (see .ebextensions/00_general.config for corresponding setting).

	npm install
	bower install

Run development environment by simply typing:

	gulp dev

Then navigate to ``localhost:8081``.

This will automatically watch for changes in development scripts and styles (see file types in gulpfile).

### Development Database

The development database defaults to localhost:27017 as set in ./atlas_config.json. When Atlas is run locally, this is set automatically.

## Testing Environment

Client- and server-side specs are run with the following commands:

	gulp spec
	gulp spec-server

There is not separate test database.

## Production Environment

Atlas can be deployed by simply typing:

	gulp deploy

This will automatically compile production assets (minified for css, minified + gzipped for js), commit the changes with a standard commit message and deploy the production server.

The ``.ebextensions`` folder supplies the configuration settings that ensure Atlas can be correctly load balanced and connected to the database. An important part of this is deploying within a VPC, if the database instance was deployed in VPC also. This will ensure that MongoDB ports can be opened between the database instance and all Elastic Beanstalk instances, as they launch on demand.

## Production Database

The production database is set in ./atlas_config.json. Atlas connects to this database automatically in production mode, distinguishing between dev and production databases by reading environment variables. The environment is set to production in an eb extension (see below).

## Lessons learned

### Overflow x, y and combinations

The [W3C spec](http://www.w3.org/TR/css3-box/#overflow-x) says that though overflow-x and overflow-y values may be different, combinations with visible are not possible.

### SASS optimization

### MongoClient Fields

A MongoDB query in Node typically works like this:

	db.collection('somes').find(query, fields);

The fields variable in my case was conditionally set based on the query parameters, and ended up being undefined in some cases. To my surprise, the API didn't return anything, and froze the browser.

Turns out, if the fields is undefined, it must not be passed into the method..

### React Component Lifecycle Level 1.1

``componentDidMount`` methods will execute in the order grandchild - child - parent, whereas ``componentWillMount`` methods will execute the other way around. I found this knowledge useful when I transitioned a codebase from Marionette.js to React.js, and kept Marionette's global messaging system so that components could listen to it and updated themselves (since many of the props were objects, changing them internally didn't trigger an update).
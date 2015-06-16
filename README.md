# Atlas

Policy analysis tool for New America's Education Policy Program.

Url: http://atlas.newamerica.org/welcome
Related Url: http://build.atlas.newamerica.org/

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
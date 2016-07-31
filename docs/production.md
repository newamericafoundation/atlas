Atlas can be deployed by simply typing:

	gulp deploy

This will automatically compile production assets (minified for css, minified + gzipped for js), commit the changes with a standard commit message and deploy to the production server.

The ``.ebextensions`` folder supplies the configuration settings that ensure Atlas can be correctly load balanced and connected to the database. An important part of this is deploying within a VPC, if the database instance was deployed inside a VPC also. This will ensure that MongoDB ports can be opened between the database instance and all Elastic Beanstalk instances, as they launch and close on demand.

## Production Database

The production database is set in the environment under the key ``PRODUCTION_DB_URL``. Atlas connects to this database automatically in production mode, distinguishing between dev and production databases by reading environment variables. The environment is set to production in an eb extension (see below).
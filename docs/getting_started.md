# Get started with Atlas

It's not that bad :)

* clone the repository and navigate to its root in terminal.
* in the meantime, install Node and Bower using Homebrew. ``brew install node``, ``brew install mongodb``. For MongoDB, follow additional steps [from this guide](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/).
* run ``npm install``. This installs server-side dependencies (a lot of which are used on the client).
* run ``bower install``. This installs client-side dependencies for which npm doesn't have an equivalent bundler.
* run ``npm install webpack -g``. Webpack is the module bundler and should be installed globally.
* obtain development mode secrets: ``.env`` (environment variables) and ``atlas.pem`` (the key to get access to the production servers), which should be copied into the root of the project directory, and are already included in ``.gitignore``. @pickled-plugins should have them.
* obtain a database dump by visiting ``static.atlas.newamerica.org`` (S3 bucket) or creating a new clone as follows:
	* clone the production database: run ``gulp db-shell-into-remote-instance``. This gets you access to the remote database instance. Navigate to ``/db_backup`` and delete the previous database dump by running ``sudo rm -rf dump``. Then, create a fresh dump by running ``sudo mongodump --db mongoid``.
	* download the dump by typing ``gulp db-download-remote-backup`` and restore the database collections on your local mongo (if mongo is not installed, it is easiest with homebrew: ``brew install mongodb``).
* fire up the database by typing ``mongod`` in the terminal. restore the database from the dump: ``mongorestore --db mongoid projects.bson``.
* run the development environment which requires three terminal windows running the following two commands (leave mongod running): ``npm run dev`` (module bundler that compiles JavaScripts and SASS files), and ``npm run server`` (runs development server).
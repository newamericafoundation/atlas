# Get started with Atlas

It's not that bad :)

* clone the repository and navigate to its root in terminal.
* run ``npm install``.
* run ``npm install webpack -g``. This is the module bundler and should be installed globally.
* obtain development mode secrets: ``.env`` (environment variables) and ``atlas.pem`` (the key to get access to the production servers), which should be copied into the root of the project directory. @pickled-plugins should have them.
* clone the production database: run ``gulp db-shell-into-remote-instance``. This gets you access to the remote database instance. Navigate to ``/db_backup`` and delete the previous database dump by running ``sudo rm -rf dump``. Then, create a fresh dump by running ``sudo mongodump --db mongoid``.
* download the dump by typing ``gulp db-download-remote-backup`` and restore the database collections on your local mongo (if mongo is not installed, it is easiest with homebrew: ``brew install mongodb``).
* run the development environment which requires three terminal windows running the following: ``npm run dev`` (module bundler that compiles JavaScripts and SASS files), ``mongod`` (runs database), and ``npm run server`` (runs development server).
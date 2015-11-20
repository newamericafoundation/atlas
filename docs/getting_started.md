# Get started with Atlas

It's not that bad:

* clone the repository and navigate to its root in terminal.
* run ``npm install``.
* run ``npm install webpack -g``. This is the module bundler.
* obtain development mode secrets: ``.env`` (environment variables) and ``atlas.pem`` (the key to get into the production servers), which should be copied into the root directory. @pickled-plugins should have them.
* obtain a clone of the production database: run ``gulp db-shell-into-remote-instance``. This gets you access to the remote database instance. Navigate to ``/db_backup`` and delete the previous database dump by running ``sudo rm -rf dump``. Then, obtain a fresh dump by running ``sudo mongodump --db mongoid``.
* 
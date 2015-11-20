# The Database

Atlas runs on MongoDB hosted on an EC2 instance on AWS. As such, backups, restores, wirings are not automated. This is a quick guide on how to access the database, back it up, and troubleshoot issues.

## Backups

Backups are stored in the S3 bucket static.atlas.newamerica.org.

* run ``gulp db-shell-into-remote-instance``. This gets you access to the remote database instance. 
* navigate to ``/db_backup`` on the instance and delete the previous database dump by running ``sudo rm -rf dump``.
* obtain a fresh dump by running ``sudo mongodump --db mongoid``.
* exit the instance.
* check the ``LOCAL_DB_BACKUP_PATH`` environment variable on the local project folder. It normally points to an outside path such as ``../atlas-db``. Make sure this folder exists.
* run ``gulp db-download-remote-backup``. The timestamped database dump files will be downloaded from the remote instance in this folder. Now you can copy these into the bucket among all the previous ones. Manage and delete old ones as needed.
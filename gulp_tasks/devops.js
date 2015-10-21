import gulp from 'gulp';
import shell from 'gulp-shell';
import moment from 'moment';

import config from './config.js';

var secretEnv = config.getLocalSecretEnv();

// Pem key path, assuming there is a secrets folder outside of the project folder.
//   (this prevents accidental commits to the repository)
var pem_key_path = `${config.localPemKeyPath}`;

// DB backup path on remote instance.
var db_remote_backup_files = secretEnv['PRODUCTION_DB_URL_SSH'] + ':/db_backup/dump/mongoid';

// Shell into instance.
gulp.task('db-shell-into-remote-instance', shell.task([
	`ssh -t -t -i ${pem_key_path} ${secretEnv['PRODUCTION_DB_URL_SSH']}`
]));

var dest_dir_path = `${config.localDbBackupPath}${moment().format('YYYY_MM_DD_HH_mm')}_dump`;

// Download remote backup.
gulp.task('db-download-remote-backup', shell.task([
	`mkdir -p ${dest_dir_path}`,
	`scp -r -i ${pem_key_path} ${db_remote_backup_files} ${dest_dir_path}`
], { quiet: true }));
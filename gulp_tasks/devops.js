import gulp from 'gulp';
import shell from 'gulp-shell';
import * as env from './../../secrets/atlas.json';

// Pem key path, assuming there is a secrets folder outside of the project folder.
//   (this prevents accidental commits to the repository)
var pem_key_path = './../secrets/atlas.pem';

// DB backup path on remote instance.
var db_backup_remote = `${env['PRODUCTION_DB_URL']}:/db_backup/`;

// Shell into instance.
gulp.task('shell-into-instance', shell.task([
	`ssh -t -t -i ${pem_key_path} ${env['PRODUCTION_DB_URL']}`
]));

// Download remote backup.
gulp.task('download-remote-backup', shell.task([
	`scp -r -i ${pem_key_path} ${db_backup_remote} /`
], { quiet: true }));
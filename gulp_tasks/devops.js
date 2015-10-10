import gulp from 'gulp';
import shell from 'gulp-shell';
import * as env from './../../secrets/atlas.json';
import moment from 'moment';

// Pem key path, assuming there is a secrets folder outside of the project folder.
//   (this prevents accidental commits to the repository)
var pem_key_path = './../secrets/atlas.pem';

// DB backup path on remote instance.
var db_remote_backup_files = env['PRODUCTION_DB_URL_SSH'] + ':/db_backup/dump/mongoid';

// Shell into instance.
gulp.task('db-shell-into-remote-instance', shell.task([
	`ssh -t -t -i ${pem_key_path} ${env['PRODUCTION_DB_URL_SSH']}`
]));

var dest_dir_path = `../atlas_db/${moment().format('YYYY_MM_DD_HH_mm')}_dump`;

// Download remote backup.
gulp.task('db-download-remote-backup', shell.task([
	`mkdir -p ${dest_dir_path}`,
	'scp -r -i ' + pem_key_path + ' ' + db_remote_backup_files + ' ' + dest_dir_path
], { quiet: true }));
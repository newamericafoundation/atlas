import gulp from 'gulp';
import shell from 'gulp-shell';
import * as env from './../../secrets/atlas.json';

var pem_key_path = './../secrets/atlas.pem';

var db_backup_remote = `${env['PRODUCTION_DB_URL']}:/db_backup/`;

gulp.task('shell-into-instance', shell.task([
	`ssh -t -t -i ${pem_key_path} ${env['PRODUCTION_DB_URL']}`
]));

gulp.task('download-remote-backup', shell.task([
	`scp -r -i ${pem_key_path} ${db_backup_remote} /`
], { quiet: true }));
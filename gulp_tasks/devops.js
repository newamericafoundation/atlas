import gulp from 'gulp'
import shell from 'gulp-shell'
import moment from 'moment'

var { LOCAL_DB_BACKUP_PATH, PEM_KEY_PATH, PRODUCTION_DB_URL_SSH } = process.env

// DB backup path on remote instance.
var db_remote_backup_files = PRODUCTION_DB_URL_SSH + ':/db_backup/dump/mongoid'

// Shell into instance.
gulp.task('db-shell-into-remote-instance', shell.task([
	`ssh -t -t -i ${PEM_KEY_PATH} ${PRODUCTION_DB_URL_SSH}`
]))

var dest_dir_path = `${LOCAL_DB_BACKUP_PATH}${moment().format('YYYY_MM_DD_HH_mm')}_dump`

// Download remote backup.
gulp.task('db-download-remote-backup', shell.task([
	`mkdir -p ${dest_dir_path}`,
	`scp -r -i ${PEM_KEY_PATH} ${db_remote_backup_files} ${dest_dir_path}`
], { quiet: true }))
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import liveReload from 'gulp-livereload';
import notify from 'gulp-notify';
import path from 'path';
import env from './../../secrets/atlas.json';

import config from './config.js';

// A list of development tasks and when they should run.
var devTasks = [

    {
        name: 'css-build',
        shouldRun: function(file) {
            var ext = path.extname(file);
            return (ext === '.scss');
        }
    },

    {
        name: 'js-build-source',
        shouldRun: function(file) {
            var ext = path.extname(file);
            return ((file.slice(0, 10) === 'app/assets') && (['.js', '.coffee'].indexOf(ext) > -1));
        }
    }

];

/*
 * Task list builder.
 * @param {array} changedFiles - A list of changed files.
 * @returns {array} tasks - A list of task names.
 */

var buildTaskList = function(changedFiles) {
    var tasks = [];
    changedFiles.forEach((file) => {
        devTasks.forEach((devTask) => {
            if ((tasks.indexOf(devTask.name) === -1) && (devTask.shouldRun(file))) {
                tasks.push(devTask.name);
            }
        });
    });
    if (tasks.length === 0) { return [ 'null' ]; }
    return tasks;
};

var envName = config.production ? 'production' : 'development';

env.NODE_ENV = envName;

var ignore = {
    'development': [ 
        'node_modules/**/*', 
        'bower_components/**/*', 
        'spec/**/*', 
        'db/**/*',
        'public/**/*',
        'app/components/**/*', // monitored by watchify
        'app/models/**/*' // monitored by watchify
    ],
    'production': [
        'app/**/*'
    ]
};

var ext = {
    'development': 'js jade scss coffee',
    'production': ''
};

// Development environment.
gulp.task('dev', () => {

    if(env === 'development') { liveReload.listen(); }

    gulp.start('bundle-watch');
    nodemon({
        script: './app.js',
        env: env,
        ext: ext[envName],
        ignore: ignore[envName],
        tasks: buildTaskList
    })
    .on('restart', () => { 
        gulp.src('./app.js')
            .pipe(liveReload())
            .pipe(notify('Reloading, please wait..'));
    });
});
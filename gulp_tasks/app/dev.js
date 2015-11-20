import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import liveReload from 'gulp-livereload';
import notify from 'gulp-notify';
import path from 'path';

// Development environment.
gulp.task('dev', () => {

    liveReload.listen()

    nodemon({
        script: './app.js',
        ext: 'js jade scss coffee',
        ignore: [ 
            'node_modules/**/*', 
            'bower_components/**/*', 
            'spec/**/*', 
            'db/**/*',
            'public/**/*',
            'app/components/**/*', // monitored by watchify
            'app/models/**/*' // monitored by watchify
        ],
        tasks: [ 'css' ]
    })
    .on('restart', () => { 
        gulp.src('./app.js')
            .pipe(liveReload())
            .pipe(notify('Reloading, please wait..'));
    })
})
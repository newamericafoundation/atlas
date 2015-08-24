import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import liveReload from 'gulp-livereload';

// Development environment.
gulp.task('dev', () => {
    liveReload.listen();
    nodemon({
        script: './app.js',
        ext: 'css js gz jade scss coffee eco cjsx jsx',
        tasks: function(changedFiles) {
            return [ 'default' ];
        } 
    })
    .on('restart', function() { 
        gulp.src('./app.js')
            .pipe(liveReload());
    });
});

// Development environment for the intranet project.
gulp.task('dev-intranet', () => {
    liveReload.listen();
    nodemon({
        script: './app.js',
        ext: 'css js gz jade scss coffee eco cjsx',
        tasks: function(changedFiles) {
            return [ 'default' ];
        } 
    })
    .on('restart', function() { 
        gulp.src('./app.js')
            .pipe(liveReload());
    });
});
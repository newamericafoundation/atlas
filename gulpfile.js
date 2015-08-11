var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    shell = require('gulp-shell'),
    liveReload = require('gulp-livereload');

require('./build_tasks/spec.js');
require('./build_tasks/css.js');
require('./build_tasks/js.js');

// Run this task on the command line by simply typing 'gulp'.
gulp.task('default', ['js-build', 'css-build']);

// Development environment.
// Note: this does not compile server-side models on the client.
//   those need to be compiled using their separate gulp task.
gulp.task('dev', function() {
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

// Deploy using Elastic Beanstalk. 
// See ./.elasticbeanstalk and ./.ebextensions for deploy details.
gulp.task('deploy', shell.task([
  'gulp --production',
  'git add -A',
  'git commit -m "fresh deploy"',
  'git push origin master',
  'eb deploy'
]));
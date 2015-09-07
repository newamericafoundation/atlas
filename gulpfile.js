require('babel/register');

var gulp = require('gulp');

require('./gulp_tasks/spec.js');
require('./gulp_tasks/css.js');
require('./gulp_tasks/js.js');

// Run this task on the command line by simply typing 'gulp'.
gulp.task('default', [ 'js-build', 'css-build' ]);
gulp.task('default-intranet', [ 'css-build-intranet' ]);

require('./gulp_tasks/dev.js');
require('./gulp_tasks/deploy.js');
require('./gulp_tasks/devops.js');
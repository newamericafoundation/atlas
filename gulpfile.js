require('babel/register');

var gulp = require('gulp');

require('./build_tasks/spec.js');
require('./build_tasks/css.js');
require('./build_tasks/js.js');

// Run this task on the command line by simply typing 'gulp'.
gulp.task('default', ['js-build', 'css-build']);
gulp.task('default-intranet', [ 'css-build-intranet' ]);

require('./build_tasks/dev.js');
require('./build_tasks/deploy.js');



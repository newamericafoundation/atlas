require('babel/register');

var gulp = require('gulp');

require('./gulp_tasks/spec.js');
require('./gulp_tasks/css.js');
require('./gulp_tasks/js/index.js');

require('./gulp_tasks/dev.js');
require('./gulp_tasks/deploy.js');
require('./gulp_tasks/devops.js');

require('./gulp_tasks/default.js');
import gulp from 'gulp';

require('./app/css.js');
require('./app/js.js');
require('./app/js_one_off_tasks.js');

require('./geo.js');

require('./services/lambda/index.js');

require('./devops.js');
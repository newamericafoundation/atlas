import gulp from 'gulp';

require('./app/css.js');
require('./app/js/index.js');
require('./app/spec.js');
require('./app/dev.js');
require('./app/deploy.js');

require('./default.js');
require('./extract_boilerplate.js');
require('./geo.js');

require('./services/lambda/index.js');

require('./devops.js');
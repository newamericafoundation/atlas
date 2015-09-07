import gulp from 'gulp';
import shell from 'gulp-shell';

// Deploy using Elastic Beanstalk. 
// See ./.elasticbeanstalk and ./.ebextensions for deploy details.
gulp.task('deploy', shell.task([
  'gulp --production',
  'git add -A',
  'git commit -m "fresh deploy"',
  'git push origin master',
  'eb deploy'
]));
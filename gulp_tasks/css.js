var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    del = require('del'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip'),
    copy = require('gulp-copy'),
    rev = require('gulp-rev');

var config = require('./config.js');

gulp.task('css-clean', function(next) {
    return del([ 'public/assets/styles/**/*' ], next);
});

gulp.task('css-build', ['css-clean'], function() {
    return gulp.src('./app/assets/styles/app.scss')
        .pipe(sass())
        .pipe(config.production ? minifyCss() : util.noop())
        .pipe(rename('app.css'))
        .pipe(gulp.dest('public/assets/styles/'))
        .pipe(rev())
        .pipe(gulp.dest('public/assets/styles'))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/styles'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/styles'));
});

gulp.task('css-ship-to-intranet', [ 'css-build' ], function() {
  return gulp.src('./public/assets/styles/app.css')
    .pipe(copy('./../my-newamerica-org/', { prefix: 0 }));
});
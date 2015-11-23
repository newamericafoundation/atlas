var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    del = require('del'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip'),
    copy = require('gulp-copy'),
    rev = require('gulp-rev');

gulp.task('css-clean', function(next) {
    return del([ 'public/assets/styles/**/*' ], next);
});

gulp.task('css', ['css-clean'], function() {
    return gulp.src('./app/assets/styles/app.scss')
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(rename('app.css'))
        .pipe(gulp.dest('public/assets/styles/'))
        .pipe(rev())
        .pipe(gulp.dest('public/assets/styles'))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/styles'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/styles'));
});
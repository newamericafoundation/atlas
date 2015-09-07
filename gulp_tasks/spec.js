var gulp = require('gulp'),
    concat = require('gulp-concat'),
    del = require('del'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    mocha = require('gulp-mocha'),
    // mochaPhantomJs = require('gulp-mocha-phantomjs'),
    coffee = require('gulp-coffee');

gulp.task('js-build-spec', function() {
    return gulp.src([ './spec/site/scripts/atlas/**/*.js.coffee', './spec/site/scripts/config/**/*.js.coffee' ])
        .pipe(coffee())
        .pipe(concat('all-spec.js'))
        .pipe(gulp.dest('./spec/site'));
});

gulp.task('js-build-fixtures', function() {
    return gulp.src([ './spec/site/scripts/fixtures/**/*.js.coffee' ])
        .pipe(coffee())
        .pipe(concat('all-fixtures.js'))
        .pipe(gulp.dest('./spec/site'));
});

// gulp.task('spec', [ 'js-build', 'js-build-spec', 'js-build-fixtures' ], function() {
//     return gulp.src('spec/site/runner.html')
//         .pipe(mochaPhantomJs({ reporter: 'spec' }));
// });

gulp.task('spec-server', function() {
    return gulp.src('spec/models/**/*.js')
        .pipe(mocha({ reporter: 'spec' }));
});
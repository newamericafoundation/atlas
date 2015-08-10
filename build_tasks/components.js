var gulp = require('gulp'),
    cjsx = require('gulp-cjsx'),
    insert = require('gulp-insert'),
    concat = require('gulp-concat');

var config = require('./config.js');

gulp.task('js-components', function() {
    return gulp.src(config.source.js.component)
        .pipe(concat('__auto__comp.cjsx'))
        .pipe(cjsx({
            bare: true
        }))
        .pipe(insert.prepend("var React = require('react');\n\n"))
        .pipe(insert.append("\n\nmodule.exports = Comp;"))
        .pipe(gulp.dest('./app/components'));
});
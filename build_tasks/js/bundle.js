import _ from 'underscore';
import gulp from 'gulp';
import browserifyGlobalShim from 'browserify-global-shim';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

var browserifyArgs = {
    entries: [ './app/models/__client__.js' ]
};

var globalShim = browserifyGlobalShim.configure({
    'jquery': '$',
    'underscore': '_',
    'backbone': 'Backbone',
    'mongodb': 'mongodb'
});

var getBrowserifyBundler = (entries) => {
    var args = _.extend({ entries: entries }, watchify.args, { debug: true });
    var b = browserify(args);
    b.transform(babelify);
    b.transform(globalShim);
    return b;
};

var getWatchifyBundler = () => {
    return watchify(getBrowserifyBundler());
};

var writeBundle = (instance, name, dest) => {
    return instance.bundle()
        .pipe(source(name))
        .pipe(gulp.dest(dest));
};

// make server-side model definitions available on the client.
gulp.task('bundle-models', () => {
    var bundler = getBrowserifyBundler('./app/models/__client__.js');
    return writeBundle(bundler, '__auto__models.js', './app/assets/scripts/atlas');
});

// make server-side model definitions available on the client.
gulp.task('bundle-components', () => {
    var bundler = getBrowserifyBundler('./app/components/routes.jsx');
    return writeBundle(bundler, 'component.js', './public/assets/scripts/partials');
});
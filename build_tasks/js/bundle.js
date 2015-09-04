import _ from 'underscore';
import gulp from 'gulp';
import browserifyGlobalShim from 'browserify-global-shim';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

var browserifyArgs = {
    entries: [ './app/models/__client__.js' ],
    noParse: [ 'jquery' ].map(require.resolve)
};

var globalShim = browserifyGlobalShim.configure({
    'jquery': '$',
    'underscore': '_',
    'backbone': 'Backbone',
    'mongodb': 'mongodb'
});

var getBrowserifyBundler = () => {
    var args = _.extend(browserifyArgs, watchify.args, { debug: true });
    var b = browserify(args);
    b.transform(babelify);
    b.transform(globalShim);
    return b;
};

var getWatchifyBundler = () => {
    return watchify(getBrowserifyBundler());
};

var writeBundle = (instance) => {
    return instance.bundle()
        .pipe(source('__auto__models.js'))
        .pipe(gulp.dest('./app/assets/scripts/atlas'));
};

// make server-side model definitions available on the client.
gulp.task('bundle-models', () => {
    return writeBundle(getBrowserifyBundler());
});
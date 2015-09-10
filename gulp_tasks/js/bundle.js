import _ from 'underscore';
import gulp from 'gulp';
import browserifyGlobalShim from 'browserify-global-shim';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

// Application entry point.
var entry = './app/components/index.jsx';

var globalShim = browserifyGlobalShim.configure({
    'jquery': '$',
    'underscore': '_',
    'backbone': 'Backbone'
});

var getBrowserifyBundler = (entries) => {
    var args = _.extend({ entries: entry }, watchify.args, { debug: true });
    var b = browserify(args);
    b.transform(babelify);
    b.transform(globalShim);
    return b;
};

var getWatchifyBundler = (entries) => {
    return watchify(getBrowserifyBundler(entries));
};

var writeBundle = (bundler, name = 'component.js', dest = './public/assets/scripts/partials') => {
    return bundler.bundle()
        .on('error', (err) => {
            console.log('Browserify error..');
            console.dir(err);
        })
        .pipe(source(name))
        .pipe(gulp.dest(dest));
};

// make server-side component definitions available on the client.
gulp.task('bundle', () => {
    var bundler = getBrowserifyBundler();
    return writeBundle(bundler);
});

// make server-side component definitions available on the client.
gulp.task('bundle-watch', () => {
    var bundler = getWatchifyBundler();
    bundler.on('update', () => {
        console.log('Rebundling..')
        writeBundle(bundler);
    });
    return writeBundle(bundler);
});
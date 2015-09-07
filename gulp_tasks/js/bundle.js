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
    'backbone': 'Backbone'
});

var getBrowserifyBundler = (entries) => {
    var args = _.extend({ entries: entries }, watchify.args, { debug: true });
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
    var bundler = getBrowserifyBundler('./app/components/routes.jsx');
    return writeBundle(bundler);
});

// make server-side component definitions available on the client.
gulp.task('bundle-watch', () => {
    var bundler = getWatchifyBundler('./app/components/routes.jsx');
    bundler.on('update', () => {
        console.log('Reboundling..')
        writeBundle(bundler);
    });
    return writeBundle(bundler);
});
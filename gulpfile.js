'use strict';

var del = require('del'),
    gulp = require('gulp'),
    gulpConcat = require('gulp-concat'),
    gulpHelp = require('gulp-help')(gulp),
    gulpJshint = require('gulp-jshint'),
    gulpMinifyCss = require('gulp-minify-css'),
    gulpRename = require('gulp-rename'),
    gulpSass = require('gulp-sass'),
    gulpUglify = require('gulp-uglify'),
    gulpWebserver = require('gulp-webserver'),
    streamqueue = require('streamqueue');

/**
 * @name all
 * @description Generates documentation and builds application
 */
gulp.task('all', 'Generates documentation and builds application', [
    'css',
    'js:app',
    'js:libs',
    'js:lint'
]);

/**
 * 
 */
gulp.task('clean', 'Cleans the build directory', function() {
    return del([
        'src/dist/css/*',
        'src/dist/js/*'
    ]);
});

/**
 * @name styles
 * @description Compile SASS
 */
gulp.task('css', 'Compile SASS', function() {
    gulp.src('src/content/styles/*.scss')
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulpMinifyCss({
            advanced: false,
            aggressiveMerging: false,
            keepSpecialComments: false,
            rebase: false,
            sourceMap: false
        }))
        .pipe(gulp.dest('src/dist/css'));
});

/**
 * @name app
 * @description Compiles the application JavaScript
 */
gulp.task('js:app', 'Compiles the application JavaScript', function() {
    var stream = streamqueue({objectMode: true},
        gulp.src('src/app/**/*.module.js'),
        gulp.src([
            'src/app/**/*.js',
            'src/dist/docs/js/*.js',
            '!src/app/**/*.module.js'
        ]));

    return compileJavaScript(stream, 'app');
});

/**
 * @name app
 * @description Compiles the third party JavaScript
 */
gulp.task('js:libs', 'Compiles the third party JavaScript', function() {
    var stream = streamqueue({objectMode: true},
        gulp.src('src/scripts/angular/angular.js'),
        gulp.src([
            'src/scripts/**/*.js',
            '!src/scripts/angular/angular.js'
        ]));

    return compileJavaScript(stream, 'vendor');
});

/**
 * @name lint
 * @description Run JSHint to check for JavaScript code quality
 */
gulp.task('js:lint', 'Run JSHint to check for JavaScript code quality', function() {
    gulp.src('src/app/**/*.js')
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter('default'));
});

/**
 * @name serve
 * @description Runs a local webserver with livereload
 */
gulp.task('serve', 'Runs a local webserver', [], function() {
    gulp.src('src')
        .pipe(gulpWebserver({
            fallback: 'index.html',
            livereload: false,
            open: true
        }));
});

/**
 * @name watch
 * @description Watches for changes and rebuilds
 */
gulp.task('watch', 'Watches for changes and recompiles', function() {
    gulp.watch(['src/app/**/*.js'], [
        'js:app',
        'js:lint'
    ]);

    gulp.watch(['src/scripts/**/*.js'], [
        'js:libs'
    ]);

    gulp.watch(['src/content/styles/**/*.scss'], [
        'css'
    ]);
});

/**
 * @ngdoc method
 * @name compileJavaScript
 * @param {Object} stream Stream object
 * @param {String} name Name of output file
 */
function compileJavaScript(stream, name) {
    stream
        .pipe(gulpConcat(name + '.js'))
        .pipe(gulpUglify({
            compress: false,
            mangle: false
        }))
        .pipe(gulpRename(name + '.min.js'))
        .pipe(gulp.dest('src/dist/js'));
}

'use strict';

var addStream = require('add-stream'),
    del = require('del'),
    gulp = require('gulp'),
    gulpAngularTemplateCache = require('gulp-angular-templatecache'),
    gulpConcat = require('gulp-concat'),
    gulpHelp = require('gulp-help')(gulp),
    gulpJshint = require('gulp-jshint'),
    gulpMinifyCss = require('gulp-minify-css'),
    gulpRename = require('gulp-rename'),
    gulpSass = require('gulp-sass'),
    gulpUglify = require('gulp-uglify'),
    gulpWebserver = require('gulp-webserver'),
    streamqueue = require('streamqueue');

gulp.task('all', 'Build application', [
    'css:app',
    'js:app',
    'js:libs',
    'js:lint'
]);

gulp.task('dist', 'Build multiselect', [
    'css:dist',
    'js:dist'
]);

gulp.task('clean', 'Clean build directory', function() {
    return del([
        'src/dist/css/*',
        'src/dist/js/*'
    ]);
});

gulp.task('css:app', 'Compile application SASS', function() {
    gulp.src('src/content/styles/app.scss')
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

gulp.task('css:dist', 'Compile multiselect SASS', function() {
    gulp.src('src/content/styles/multiselect.scss')
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest('src/dist/css'));
});

gulp.task('js:app', 'Compile application JavaScript', function() {
    var stream = streamqueue({objectMode: true},
        gulp.src('src/app/**/*.module.js'),
        gulp.src([
            'src/app/**/*.js',
            '!src/app/**/*.module.js'
        ]))
        .pipe(addStream.obj(gulp.src('src/app/**/*.html')
            .pipe(gulpAngularTemplateCache('templates.js', {
                module: 'amo.multiselect'
            })
        )));

    return compileJavaScript(stream, 'app');
});

gulp.task('js:dist', 'Build directive JavaScript and template', [
    'js:dist:compressed'
]);

gulp.task('js:dist:compressed', false, ['js:dist:uncompressed'], function() {
    var stream = gulp.src('src/dist/js/multiselect.js');

    return compileJavaScript(stream, 'multiselect');
});

gulp.task('js:dist:uncompressed', false, function() {
    var stream = streamqueue({objectMode: true},
        gulp.src('src/app/multiselect/**/*.module.js'),
        gulp.src([
            'src/app/multiselect/**/*.js',
            '!src/app/multiselect/**/*.module.js'
        ]))
        .pipe(addStream.obj(gulp.src('src/app/**/*.html')
            .pipe(gulpAngularTemplateCache('templates.js', {
                module: 'amo.multiselect'
            })
        )));

    return compileJavaScript(stream, 'multiselect', false);
});

gulp.task('js:libs', 'Compile third party JavaScript', function() {
    var stream = streamqueue({objectMode: true},
        gulp.src('src/scripts/jquery/jquery.js'),
        gulp.src('src/scripts/angular/angular.js'),
        gulp.src([
            'src/scripts/**/*.js',
            '!src/scripts/jquery/jquery.js',
            '!src/scripts/angular/*.js'
        ]));

    return compileJavaScript(stream, 'vendor');
});

gulp.task('js:lint', 'Run JSHint to check for JavaScript code quality', function() {
    gulp.src('src/app/**/*.js')
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter('default'));
});

gulp.task('serve', 'Run a local webserver', function() {
    gulp.src('src')
        .pipe(gulpWebserver({
            fallback: 'index.html',
            livereload: false,
            open: true
        }));
});

gulp.task('watch', 'Watch for changes and recompile', function() {
    gulp.watch(['src/app/**/*.js'], [
        'js:app',
        'js:lint'
    ]);

    gulp.watch(['src/app/**/*.html'], [
        'js:app'
    ]);

    gulp.watch(['src/scripts/**/*.js'], [
        'js:libs'
    ]);

    gulp.watch(['src/content/styles/**/*.scss'], [
        'css:app'
    ]);
});

/**
 * @ngdoc method
 * @name compileJavaScript
 * @param {Object} stream Stream object
 * @param {String} name Name of output file
 * @param {Boolean} [uglify=true]
 */
function compileJavaScript(stream, name, uglify) {
    var outputPath = 'src/dist/js';

    if (typeof uglify === 'undefined') {
        uglify = true;
    }

    stream = stream.pipe(gulpConcat(name + '.js'));

    if (uglify) {
        stream = stream
            .pipe(gulpUglify({
                compress: false,
                mangle: false
            }))
            .pipe(gulpRename(name + '.min.js'));
    }

    return stream.pipe(gulp.dest(outputPath));
}

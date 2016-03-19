'use strict';

var addStream = require('add-stream'),
    del = require('del'),
    gulp = require('gulp'),
    gulpAngularTemplateCache = require('gulp-angular-templatecache'),
    gulpConcat = require('gulp-concat'),
    gulpCssnano = require('gulp-cssnano'),
    gulpHelp = require('gulp-help')(gulp),
    gulpJshint = require('gulp-jshint'),
    gulpRename = require('gulp-rename'),
    gulpSass = require('gulp-sass'),
    gulpUglify = require('gulp-uglify'),
    gulpWebserver = require('gulp-webserver');

var css = {
    src: {
        app: 'src/content/styles/app.scss',
        dist: 'src/content/styles/multiselect.scss'
    },
    dest: 'src/dist/css'
};

var js = {
    src: {
        app: [
            'src/lib/**/*.module.js',
            'src/app/**/*.module.js',
            'src/lib/**/*.js',
            'src/app/**/*.js',
        ],
        dist: [
            'src/lib/**/*.module.js',
            'src/lib/**/*.js'
        ],
        libs: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'src/scripts/**/*.js'
        ],
        templates: 'src/lib/**/*.html'
    }
};

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
        css.dest + '/*',
        js.dest + '/*'
    ]);
});

gulp.task('css:app', 'Compile application SASS', function() {
    gulp.src(css.src.app)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulpCssnano())
        .pipe(gulp.dest(css.dest));
});

gulp.task('css:dist', 'Compile multiselect SASS', function() {
    gulp.src(css.src.dist)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest(css.dest));
});

gulp.task('js:app', 'Compile application JavaScript', function() {
    var stream = gulp.src(js.src.app)
        .pipe(addStream.obj(gulp.src(js.src.templates)
            .pipe(gulpAngularTemplateCache('templates.js', {
                module: 'amo.multiselect',
                root: 'multiselect'
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
    var stream = gulp.src(js.src.dist)
        .pipe(addStream.obj(gulp.src(js.src.templates)
            .pipe(gulpAngularTemplateCache('templates.js', {
                module: 'amo.multiselect',
                root: 'multiselect'
            })
        )));

    return compileJavaScript(stream, 'multiselect', false);
});

gulp.task('js:libs', 'Compile third party JavaScript', function() {
    var stream = gulp.src(js.src.libs);

    return compileJavaScript(stream, 'vendor');
});

gulp.task('js:lint', 'Run JSHint to check for JavaScript code quality', function() {
    gulp.src(js.src.app)
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
    gulp.watch(
        js.src.app,
        [
            'js:app',
            'js:lint'
        ]
    );

    gulp.watch(
        [js.src.templates],
        ['js:app']
    );

    gulp.watch(
        ['src/content/styles/**/*.scss'],
        ['css:app']
    );
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

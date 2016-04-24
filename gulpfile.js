'use strict';

var addStream = require('add-stream'),
    del = require('del'),
    gulp = require('gulp'),
    gulpAngularTemplateCache = require('gulp-angular-templatecache'),
    gulpConcat = require('gulp-concat'),
    gulpCssnano = require('gulp-cssnano'),
    gulpHelp = require('gulp-help')(gulp),
    gulpHtmlmin = require('gulp-htmlmin'),
    gulpJshint = require('gulp-jshint'),
    gulpNgAnnotate = require('gulp-ng-annotate'),
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
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
        ],
        templates: 'src/lib/**/*.html'
    },
    dest: 'src/dist/js'
};

var dist = {
    src: 'README.md',
    dest: '../angular-multiselect-package'
};

gulp.task('all', 'Build application', [
    'css:app',
    'js:app',
    'js:libs',
    'js:lint'
]);

gulp.task('dist', 'Build multiselect', ['css:dist', 'js:dist'], function() {
    gulp.src(dist.src)
        .pipe(gulp.dest(dist.dest));
});

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
        .pipe(gulp.dest(dist.dest));
});

gulp.task('js:app', 'Compile application JavaScript', function() {
    var stream = gulp.src(js.src.app).pipe(addTemplateStream());

    return compileJavaScript(stream, 'app', js.dest);
});

gulp.task('js:dist', 'Build directive JavaScript and template', [
    'js:dist:compressed'
]);

gulp.task('js:dist:compressed', false, ['js:dist:uncompressed'], function() {
    var stream = gulp.src(dist.dest + '/multiselect.js');

    return compileJavaScript(stream, 'multiselect', dist.dest);
});

gulp.task('js:dist:uncompressed', false, function() {
    var stream = gulp.src(js.src.dist).pipe(addTemplateStream());

    return compileJavaScript(stream, 'multiselect', dist.dest, false);
});

gulp.task('js:libs', 'Compile third party JavaScript', function() {
    var stream = gulp.src(js.src.libs);

    return compileJavaScript(stream, 'vendor', js.dest);
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

gulp.task('watch', 'Watch for changes and recompile', ['all'], function() {
    gulp.watch(
        js.src.app,
        [
            'js:app',
            'js:lint'
        ]
    );

    gulp.watch(
        js.src.templates,
        ['js:app']
    );

    gulp.watch(
        'src/content/styles/**/*.scss',
        ['css:app']
    );
});

/**
 * @name compileJavaScript
 * @param {Object} stream Stream object
 * @param {String} name Name of output file
 * @param {String} dest Destination path
 * @param {Boolean} [uglify=true]
 * @returns {Stream}
 */
function compileJavaScript(stream, name, dest, uglify) {
    if (typeof uglify === 'undefined') {
        uglify = true;
    }

    stream = stream
        .pipe(gulpConcat(name + '.js'))
        .pipe(gulpNgAnnotate());

    if (uglify) {
        stream = stream
            .pipe(gulpUglify({
                compress: false,
                preserveComments: 'license'
            }))
            .pipe(gulpRename(name + '.min.js'));
    }

    return stream.pipe(gulp.dest(dest));
}

/**
 * @name getTemplateStream
 * @returns {Stream}
 */
function addTemplateStream() {
    return addStream.obj(
        gulp.src(js.src.templates)
            .pipe(gulpHtmlmin({
                collapseWhitespace: true,
                conservativeCollapse: true
            }))
            .pipe(gulpAngularTemplateCache('templates.js', {
                module: 'amo.multiselect',
                root: 'amo/multiselect'
            }))
    );
}

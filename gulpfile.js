var gulp = require('gulp');
var server = require('gulp-express');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var Filter = require('gulp-filter');

gulp.task('server', function () {

    server.run({
        file: 'app.js'
    });

    //gulp.watch(['app/*.html'], server.notify);

    gulp.watch(['{.tmp,app}/styles/*.css'], server.notify);

    //gulp.watch(['app/scripts/*.js'], ['jshint']);
    //gulp.watch(['app/images/*'], server.notify);

    gulp.watch(['app.js',
        'socket/*.js',
        'config/*.js',
        'error/*.js',
        'models/*.js',
        'middleware/*.js',
        'routes/*.js'
    ], [server.run]);
});

gulp.task('css', function () {
    var filter = Filter('**/*.styl');

    return gulp.src([
        'public/stylesheets//**.styl',
        'public/stylesheets//**.css'
    ])
        .pipe(filter)
        .pipe(stylus())
        .pipe(filter.restore())
        .pipe(autoprefixer('last 15 versions'))
        .pipe(minifyCSS())
        .pipe(concat("bundle.min.css"))
        .pipe(gulp.dest('app/styles'));
});

gulp.task('default', ['server','css']);
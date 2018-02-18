var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var uglifyjs = require('uglify-es');
var uglify = require('gulp-uglify');
var composer = require('gulp-uglify/composer');
var minify = composer(uglifyjs, console);
var pump = require('pump');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

gulp.task('default', ['sass'], function() {
  gulp.watch("public/css/*.scss", ['sass']);
});

gulp.task('build', function(cb) {
  gulpSequence('compress', 'merge', 'clean', 'sass', 'hotReload')(cb)
})

gulp.task('dev', ['browserSync', 'build'], function() {
  gulp.watch("public/css/*.scss", ['sass']);
  gulp.watch("public/js/*.js", ['build']);
  gulp.watch("public/*.html", ['hotReload']);
});
 
gulp.task('sass', function(cb) {
  pump([
    sass('public/css/*.scss', {style: 'compressed'}),
    gulp.dest('public/build'),
    browserSync.reload({
      stream: true
    })
  ], cb);
});

gulp.task('browserSync', function() {
  browserSync.init({
    proxy: "http://localhost:3000"
  })
})

gulp.task('hotReload', function() {
  browserSync.reload();
})

gulp.task('compress', function(cb) {
  var options = {};
  pump([
    gulp.src('public/js/*.js'),
    babel(),
    minify(options),
    gulp.dest('public/build/dist')
  ], cb);
});

gulp.task('merge', function(cb) {
  pump([
    gulp.src('public/build/dist/*.js'),
    concat('build.js'),
    gulp.dest('public/build/')
  ], cb);
});

gulp.task('clean', function(cb) {
  pump([
    gulp.src('public/build/dist', {read: false}),
    clean()
  ], cb);
});
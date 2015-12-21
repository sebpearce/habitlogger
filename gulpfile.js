var gulp = require('gulp');
var del = require('del');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
// var browserify = require('browserify');

gulp.task('js', function() {
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('public/js'));
});

gulp.task('styles', function() {
  return sass('scss/main.scss')
    .pipe(autoprefixer({ 'browsers': 'last 2 versions' }))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('clear', function() {
  del('public/js');
  del('public/css');
});

gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('scss/main.scss', ['styles']);
});

gulp.task('default', ['clear', 'js', 'styles', 'watch']);
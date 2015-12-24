var gulp = require('gulp');
// var fs = require('fs');
var del = require('del');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
// var browserify = require('browserify');
var babel = require('gulp-babel');

gulp.task('js', function () {
  gulp.src('js/*.js')
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest('public/js'));
  gulp.src('js/vendor/*')
    .pipe(gulp.dest('public/js'));
  // gulp.src('js/**/*.js')
  // browserify('js/main.js')
  //   .transform('babelify', {presets: ['es2015']})
  //   .bundle()
  //   .pipe(fs.createWriteStream('public/js/bundle.js'));
    // .pipe(gulp.dest('public/js'));
});

gulp.task('vendors', function () {
  gulp.src('stylesheets/vendor/**/*.css')
    .pipe(gulp.dest('public/css'));
  // gulp.src('fonts/*')
  //   .pipe(gulp.dest('public/fonts'));
});

gulp.task('styles', function () {
  return sass('stylesheets/main.scss')
    .pipe(autoprefixer({ 'browsers': 'last 2 versions' }))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('clear', function () {
  del('public/js');
  del('public/css');
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('stylesheets/**/*.scss', ['styles']);
});

gulp.task('default', ['clear', 'vendors', 'js', 'styles', 'watch']);
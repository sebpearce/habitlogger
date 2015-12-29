var gulp = require('gulp');
// var fs = require('fs');
var del = require('del');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
// var browserify = require('browserify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var runSeq = require('run-sequence');

const scriptsToWatch = [
  'lib/**/*/scripts/*.js'
];

gulp.task('clear', function () {
  del(['public/js', 'public/css']);
});

gulp.task('js', function () {
  gulp.src(scriptsToWatch)
    .pipe(rename({dirname: ''})) // flattens dir structure
    .pipe(babel({
      presets: ['es2015'],
    }))
    .on('error', console.log)
    .pipe(gulp.dest('public/js'));
  // gulp.src('js/**/*.js')
  // browserify('js/main.js')
  //   .transform('babelify', {presets: ['es2015']})
  //   .bundle()
  //   .pipe(fs.createWriteStream('public/js/bundle.js'));
    // .pipe(gulp.dest('public/js'));
});

gulp.task('vendors', function () {
  gulp.src('vendor/*.css')
    .pipe(gulp.dest('public/css'));
  gulp.src('vendor/*.js')
    .pipe(gulp.dest('public/js'));
  // gulp.src('fonts/*')
  //   .pipe(gulp.dest('public/fonts'));
});

gulp.task('styles', function () {
  return sass('lib/stylesheets/main.scss')
    .pipe(autoprefixer({ 'browsers': 'last 2 versions' }))
    .pipe(minifycss())
    .on('error', console.log)
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function () {
  gulp.watch(scriptsToWatch, ['js']);
  gulp.watch('lib/stylesheets/**/*.scss', ['styles']);
});

gulp.task('default', function (cb) {
  runSeq('clear', ['vendors', 'js', 'styles'], cb);
});

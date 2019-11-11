/* eslint-disable no-undef */
/* Before using make sure you have:
   npm install --save-dev gulp gulp-clean-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass gulp-htmlmin del gulp-imagemin
*/

const gulp = require('gulp'),
    minifyCSS = require('gulp-clean-css'),
    concat = require('gulp-concat')
    uglify = require('gulp-uglify')
    prefix = require('gulp-autoprefixer')
    htmlmin = require('gulp-htmlmin')
    sass = require('gulp-sass'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    webserver = require('gulp-webserver'),
    sync = require('gulp-npm-script-sync');

//sync
gulp.task('sync', function () {
  sync(gulp);
});

//local-webserver
gulp.task('webserver', function() {
  gulp.src('dist')
  .pipe(webserver({
    port:8016,
    livereload: true,
    directoryListing: true,
    open: true,
    fallback: 'index.html'
  }))
});

// Minify & concat JS
gulp.task('js', function(){
    return gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('roos.min.js'))
    .pipe(gulp.dest('dist/js'))
});

// Compiles .scss to .css
gulp.task('sass', function(){
  return gulp.src('src/css/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('src/css'))
});

//Minify & concat CSS
gulp.task('css', ['sass'], function() { //list sass as dependency, want to compile to scss to css first
      gulp.src([
      './src/css/**/!(roos)*.css', // all .css files except css files with "roos" in start of filename (want roos.css concat last, most important & CSS order matters)
      './src/css/roos.css',
      ])
      .pipe(concat('roos.min.css'))
      .pipe(minifyCSS())
      .pipe(prefix('last 2 versions'))
      .pipe(gulp.dest('dist/css'));

      gulp.src('./src/css/roos-print.css') // separate roos-print.css
      .pipe(concat('roos-print.min.css'))
      .pipe(minifyCSS())
      .pipe(prefix('last 2 versions'))
      .pipe(gulp.dest('dist/css'));
});

//Minify HTML
gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    }).on('error', function(e){
        console.log(e);
    }))
    .pipe(gulp.dest('dist'));
});

//Remove old dist files
gulp.task('clean', function() {
     return del('dist/**', {force:true});
});

gulp.task('images', () =>
    gulp.src('src/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

gulp.task('default', ['clean'], function() {
    gulp.start('images');
    gulp.start('css');
    gulp.start('js');
    gulp.start('html');
    gulp.start('sync');
});


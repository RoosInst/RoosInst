/*
    Before using make sure you have:
    npm install --save-dev gulp gulp-minify-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass gulp-htmlmin
 */
var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat')
    uglify = require('gulp-uglify')
    prefix = require('gulp-autoprefixer')
    htmlmin = require('gulp-htmlmin')
    sass = require('gulp-sass');

// Minifies JS
gulp.task('js', function(){
    return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('roos.min.js'))
    .pipe(gulp.dest('dist/js'))
});

/*==========  Minify and concat different styles files  ==========*/

// SASS Version
// gulp.task('styles', function(){
//     return gulp.src('src/sass/**/*.sass')
//     .pipe(sass())
//     .pipe(prefix('last 2 versions'))
//     .pipe(concat('main.css'))
//     .pipe(minifyCSS())
//     .pipe(gulp.dest('public/css'))
// });

// SCSS Version
//gulp.task('styles', function(){
    //return gulp.src('src/scss/**/*.scss')
    //.pipe(sass())
    //.pipe(prefix('last 2 versions'))
    //.pipe(concat('main.css'))
    //.pipe(minifyCSS())
    //.pipe(gulp.dest('public/css'))
//});


// CSS Version
gulp.task('css', function(){
    return gulp.src([
      './src/css/!(roos)*.css', // all files that end in .js EXCEPT foobar*.js
      './src/css/roos.css',
    ])
    .pipe(concat('roos.min.css'))
    .pipe(minifyCSS())
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('dist/css'))
});

// Compiles .scss to .css
gulp.task('sass', function(){
  return gulp.src('src/css/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('src/css'))
});

// Gulp task to minify HTML files
gulp.task('html', function() {
  return gulp.src('src/*.html')
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

gulp.task('default', function() {
    gulp.run('sass') //sass before css, want to compile to scss to css first
    gulp.run('css')
    gulp.run('js')
    gulp.run('html')
});

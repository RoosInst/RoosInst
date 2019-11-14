/* eslint-disable no-undef */
/* Before using make sure you have:
   npm install --save-dev gulp gulp-clean-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass gulp-htmlmin del gulp-imagemin
   npm install gulp gulp-newer gulp-imagemin --save-dev
   npm install gulp-htmlclean gulp-noop --save-dev
   npm install gulp-deporder gulp-concat gulp-strip-debug gulp-terser gulp-sourcemaps --save-dev
   npm install gulp-sass gulp-postcss postcss-assets autoprefixer css-mqpacker cssnano --save-dev
*/

(() => {

  'use strict';

  /**************** Gulp.js 4 configuration ****************/

  const

    // development or production
    devBuild  = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development'),

    // directory locations
    dir = {
      src         : 'src/',
      build       : 'build/'
    },

    // modules
    gulp          = require('gulp'),
    del           = require('del'),
    noop          = require('gulp-noop'),
    newer         = require('gulp-newer'),
    size          = require('gulp-size'),
    imagemin      = require('gulp-imagemin'),
    htmlclean     = require('gulp-htmlclean'),
    sass          = require('gulp-sass'),
    postcss       = require('gulp-postcss'),
    sourcemaps    = devBuild ? require('gulp-sourcemaps') : null,
    browsersync   = devBuild ? require('browser-sync').create() : null,
    sync          = require('gulp-npm-script-sync');


  console.log('Gulp', devBuild ? 'development' : 'production', 'build');


  /**************** clean task ****************/

  function clean() {

    return del([ dir.build ]);

  }
  exports.clean = clean;
  exports.wipe = clean;


  /**************** images task ****************/

  const imgConfig = {
    src           : dir.src + 'src/images/**/*',
    build         : dir.build + 'build/images/',

    minOpts: {
      optimizationLevel: 5
    }
  };

  function images() {

    return gulp.src(imgConfig.src)
      .pipe(newer(imgConfig.build))
      .pipe(imagemin(imgConfig.minOpts))
      .pipe(size({ showFiles:true }))
      .pipe(gulp.dest(imgConfig.build));

  }
  exports.images = images;


  /**************** CSS task ****************/

  const cssConfig = {

    src         : dir.src + '/css/roos.scss',
    watch       : dir.src + '/css/**/*.scss',
    build       : dir.build + '/css/',
    sassOpts: {
      sourceMap       : devBuild,
      outputStyle     : 'nested',
      imagePath       : '/images/',
      precision       : 3,
      errLogToConsole : true
    },

    postCSS: [
      require('postcss-assets')({
        loadPaths: ['images/'],
        basePath: dir.build
      }),
      require('autoprefixer')({
        browsers: ['> 1%']
      })
    ]

  }

   /**************** HTML task ****************/

   const htmlConfig = {
    src         : dir.src + '/',
    watch       : dir.src + '/**/*.html',
    build       : dir.build + '/'
  }

  /**************** JS task ****************/

  const jsConfig = {
    src         : dir.src + '/js/**/*',
    watch       : dir.src + '/js/**/*.js',
    build       : dir.build + '/js/'
  }
 
// HTML processing
function html() {
  const out = build + '/';

  return gulp.src(src + '/**/*')
    .pipe(newer(out))
    .pipe(devBuild ? noop() : htmlclean())
    .pipe(gulp.dest(out));
}
exports.html = gulp.series(images, html);

// JavaScript processing
function js() {

  return gulp.src(src + 'js/**/*')
    .pipe(sourcemaps ? sourcemaps.init() : noop())
    .pipe(deporder())
    .pipe(concat('main.js'))
    .pipe(stripdebug ? stripdebug() : noop())
    .pipe(terser())
    .pipe(sourcemaps ? sourcemaps.write() : noop())
    .pipe(gulp.dest(build + 'js/'));

}
exports.js = js;

  // remove unused selectors and minify production CSS
  if (!devBuild) {

    cssConfig.postCSS.push(
      require('usedcss')({ html: ['index.html'] }),
      require('cssnano')
    );

  }

  function css() {

    return gulp.src(cssConfig.src)
      .pipe(gulp.dest('../src/css'))  //readable .css back in src
      .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(sass(cssConfig.sassOpts).on('error', sass.logError))
      .pipe(postcss(cssConfig.postCSS))
      .pipe(sourcemaps ? sourcemaps.write() : noop())
      .pipe(size({ showFiles:true }))
      .pipe(gulp.dest(cssConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());

  }
  exports.css = gulp.series(images, css);


  /**************** server task (now private) ****************/

  const syncConfig = {
    server: {
      baseDir   : './build/',
      index     : 'index.html'
    },
    port        : 8016,
    open        : false
  };

  // browser-sync
  function server(done) {
    if (browsersync) browsersync.init(syncConfig);
    done();
  }


  /**************** watch task ****************/

  function watch(done) {

    // image changes
    gulp.watch(imgConfig.src, images);

    // CSS changes
    gulp.watch(cssConfig.watch, css);

    // HTML changes
    gulp.watch(htmlConfig.watch, html);

    // JS changes
    gulp.watch(jsConfig.watch, js);

    done();

  }

    /**************** sync NPM scripts task ****************/

    function syncNPMScript(done) {

      // sync build scripts
      sync(gulp);
  
      done();
  
    }

// run all tasks
exports.build = gulp.parallel(exports.html, exports.css, exports.js);

/**************** default task ****************/

 exports.default = gulp.series(exports.css, watch, server, syncNPMScript);

})();
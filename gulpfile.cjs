/* eslint-disable no-undef */
/* Before using make sure you have:
  removed 'del' requirement
   npm install --save-dev gulp gulp-clean-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass gulp-htmlmin gulp-imagemin
   npm install gulp gulp-newer gulp-imagemin gulp-webp --save-dev
   npm install gulp-htmlclean gulp-noop --save-dev
   npm install gulp-deporder gulp-concat gulp-strip-debug gulp-terser gulp-sourcemaps --save-dev
   npm install gulp-sass gulp-postcss postcss-assets autoprefixer css-mqpacker gulp-clean-css gul-concat-css cssnano --save-dev
*/

(() => {

  'use strict';

  /**************** Gulp.js 4 configuration ****************/

  const

    // development or production
    devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development'),

    // directory locations
    dir = {
      src: 'src/',
      build: 'build/'
    },

    // modules
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    concatcss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    //del = require('del'),
    deporder = require('gulp-deporder'),
    noop = require('gulp-noop'),
    newer = require('gulp-newer'),
    size = require('gulp-size'),
    //imagemin = require('gulp-imagemin'),
    htmlclean = require('gulp-htmlclean'),
    sass = require('gulp-sass')(require('sass')),
    postcss = require('gulp-postcss'),
    fileinclude = require('gulp-file-include'),
    //sync = require('gulp-npm-script-sync'),
    sourcemaps = devBuild ? require('gulp-sourcemaps') : null,
    browsersync = devBuild ? require('browser-sync').create() : null,
    webp = require("gulp-webp");



  console.log('Gulp', devBuild ? 'development' : 'production', 'build');


  /**************** clean task ****************/

  /*   function clean() {
  
      return del([dir.build]);
  
    }
    exports.clean = clean;
    exports.wipe = clean; */


  /**************** images task ****************/

  const imgConfig = {
    src: dir.src + 'images/**/*',
    build: dir.build + 'images/',

    minOpts: {
      optimizationLevel: 5
    }
  };

  function convertToWebp() {
    return gulp.src(imgConfig.src + '.{png,jpg,jpeg}')
      .pipe(webp())
      .pipe(gulp.dest(imgConfig.build));
  }
  exports.convertToWebp = convertToWebp;

  /*   function images() {
      return gulp.src(imgConfig.src)
        .pipe(newer(imgConfig.build))
        .pipe(imagemin(imgConfig.minOpts))
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest(imgConfig.build));
    }
    exports.images = images;
   */

  /**************** CSS task ****************/
  /** SASS compiles to CSS, roos-print.css just cleaned,
   *  everything is concatenated to roos-min.css */
  const cssConfig = {
    scssSrc: dir.src + 'css/**/*.scss',
    altSrc: dir.src + 'css/roos-*.css',
    src: dir.src + 'css/**/!(roos-)*.css',
    watch: dir.src + 'css/**/*',
    build: dir.build + 'css/',
    sassOpts: {
      sourceMap: devBuild,
      imagePath: imgConfig.src,
      precision: 3,
      errLogToConsole: true
    },

    postCSS: [
      require('postcss-assets')({
        loadPaths: ['images/'],
        basePath: dir.build
      }),
      require('autoprefixer'),
    ]

  }

  /**************** HTML task ****************/

  const htmlConfig = {
    src: dir.src + '*.html',
    watch: dir.src + '**/*.html',
    build: dir.build
  }

  /**************** JS task ****************/

  const jsConfig = {
    src: dir.src + 'js/**/*',
    watch: dir.src + 'js/**/*.js',
    build: dir.build + 'js/'
  }

  /**************** Include Templating w/ @file ***/
  function fileInclude() {

    gulp.src(htmlConfig.src)
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest(htmlConfig.build));
  }
  exports.fileInclude = gulp.series(fileinclude, html)

  // HTML processing
  function html() {
    const out = htmlConfig.build;

    return gulp.src(htmlConfig.src)
      .pipe(newer(out))
      .pipe(devBuild ? noop() : htmlclean())
      .pipe(gulp.dest(out));
  }
  //exports.html = gulp.parallel(images, html);
  exports.html = gulp.parallel(html);

  // JavaScript processing
  function js() {

    return gulp.src(jsConfig.src)
      .pipe(deporder())
      // .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(concat('roos.min.js'))
      // .pipe(terser())
      // .pipe(sourcemaps ? sourcemaps.write() : noop())

      .pipe(gulp.dest(jsConfig.build));

  }
  exports.js = js;

  // remove unused selectors and minify production CSS
  if (!devBuild) {

    cssConfig.postCSS.push(
      require('usedcss')({ html: ['index.html'] }),
      require('cssnano')
    );
  }

  function scss() {

    return gulp.src(cssConfig.scssSrc)  //process SASS before css
      .pipe(sass(cssConfig.sassOpts).on('error', sass.logError))
      .pipe(postcss(cssConfig.postCSS))
      .pipe(gulp.dest('src/css'));
  }

  function cssPrint() {

    return gulp.src(cssConfig.altSrc)//roos-print.css is separate
      .pipe(cleanCSS())
      .pipe(gulp.dest(cssConfig.build))
      .pipe(size({ showFiles: true }))
      .pipe(postcss(cssConfig.postCSS));
  }

  gulp.task('minify-css', () => {
    return gulp.src(CssConfig.src)
      .pipe(cleanCSS())
      .pipe(gulp.dest(CssCon.dest));
  });

  function css() {

    return gulp.src(cssConfig.src)
      .pipe(size({ showFiles: true }))
      .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(concatcss('roos.min.css'))
      .pipe(cleanCSS())
      .pipe(sourcemaps ? sourcemaps.write() : noop())
      .pipe(size({ showFiles: true }))
      .pipe(postcss(cssConfig.postCSS))
      .pipe(gulp.dest(cssConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());
  }
  //exports.css = gulp.series(images, scss, css, cssPrint);
  exports.css = gulp.series(scss, css, cssPrint);

  /**************** server task (now private) ****************/

  const syncConfig = {
    server: {
      baseDir: './build/',
      index: 'index.html'
    },
    port: 8016,
    open: false
  };

  // browser-sync
  function server(done) {
    if (browsersync) browsersync.init(syncConfig);
    done();
  }


  /**************** watch task ****************/

  function watch(done) {

    // image changes
    //gulp.watch(imgConfig.src, images);

    // CSS changes
    gulp.watch(cssConfig.watch, css);

    // HTML changes
    gulp.watch(htmlConfig.watch, html);

    // JS changes
    gulp.watch(jsConfig.watch, js);

    done();

  }

  /**************** sync NPM scripts task **************

  function syncNPMScript(done) {

    // sync build scripts
    sync(gulp);

    done();

  }
  ***/

  // run all tasks
  exports.build = gulp.parallel(exports.html, exports.css, exports.js);

  /**************** default task ****************/

  exports.default = gulp.series(exports.css, watch, server)
  // ,syncNPMScript);

})();
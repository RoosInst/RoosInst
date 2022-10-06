/* eslint-disable no-undef */
/* Before using make sure you have:
   npm install --save-dev gulp gulp-clean-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass gulp-htmlmin del gulp-imagemin
   npm install gulp gulp-newer gulp-imagemin gulp-webp --save-dev
   npm install gulp-htmlclean gulp-noop --save-dev
   npm install gulp-deporder gulp-concat gulp-strip-debug gulp-terser gulp-sourcemaps --save-dev
   npm install gulp-sass gulp-postcss postcss-assets autoprefixer css-mqpacker gulp-clean-css gul-concat-css cssnano --save-dev
*/
// modules
import esm from 'esm'
import { src as _src, dest, series, parallel, task, watch as _watch } from 'gulp'
import concat from 'gulp-concat'
//const concatcss = require('gulp-concat-css'),
import cleanCSS from 'gulp-clean-css'
import del from 'del'
import deporder from 'gulp-deporder'
import noop from 'gulp-noop'
import newer from 'gulp-newer'
import size from 'gulp-size'
//import imagemin from 'gulp-imagemin'
import htmlclean from 'gulp-htmlclean'
import sass, { logError } from 'sass'
import postcss from 'gulp-postcss'
import fileinclude from 'gulp-file-include'
//sync = require('gulp-npm-script-sync'),
import sourcemaps from 'gulp-sourcemaps'
import browsersync from 'browser-sync'
import webp from 'gulp-webp'

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

    console.log('Gulp', devBuild ? 'development' : 'production', 'build');


  /**************** clean task ****************/

  function clean() {

    return del([dir.build]);

  }
  exports.clean = clean;
  exports.wipe = clean;


  /**************** images task ****************/

  const imgConfig = {
    src: dir.src + 'images/**/*',
    build: dir.build + 'images/',

    minOpts: {
      optimizationLevel: 5
    }
  };

  function convertToWebp() {
    return _src(imgConfig.src + '.{png,jpg,jpeg}')
      .pipe(webp())
      .pipe(dest(imgConfig.build));
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

    _src(htmlConfig.src)
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(dest(htmlConfig.build));
  }
  exports.fileInclude = series(fileinclude, html)

  // HTML processing
  function html() {
    const out = htmlConfig.build;

    return _src(htmlConfig.src)
      .pipe(newer(out))
      .pipe(devBuild ? noop() : htmlclean())
      .pipe(dest(out));
  }
  //exports.html = gulp.parallel(images, html);
  exports.html = parallel(html);

  // JavaScript processing
  function js() {

    return _src(jsConfig.src)
      .pipe(deporder())
      // .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(concat('roos.min.js'))
      // .pipe(terser())
      // .pipe(sourcemaps ? sourcemaps.write() : noop())

      .pipe(dest(jsConfig.build));

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

    return _src(cssConfig.scssSrc)  //process SASS before css
      .pipe(sass(cssConfig.sassOpts).on('error', logError))
      .pipe(postcss(cssConfig.postCSS))
      .pipe(dest('src/css'));
  }

  function cssPrint() {

    return _src(cssConfig.altSrc)//roos-print.css is separate
      .pipe(cleanCSS())
      .pipe(dest(cssConfig.build))
      .pipe(size({ showFiles: true }))
      .pipe(postcss(cssConfig.postCSS));
  }

  task('minify-css', () => {
    return _src(CssConfig.src)
      .pipe(cleanCSS())
      .pipe(dest(CssCon.dest));
  });

  function css() {

    return _src(cssConfig.src)
      .pipe(size({ showFiles: true }))
      .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(concatcss('roos.min.css'))
      .pipe(cleanCSS())
      .pipe(sourcemaps ? sourcemaps.write() : noop())
      .pipe(size({ showFiles: true }))
      .pipe(postcss(cssConfig.postCSS))
      .pipe(dest(cssConfig.build))
      .pipe(browsersync ? browsersync.reload({ stream: true }) : noop());
  }
  //exports.css = gulp.series(images, scss, css, cssPrint);
  exports.css = series(scss, css, cssPrint);

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
    _watch(cssConfig.watch, css);

    // HTML changes
    _watch(htmlConfig.watch, html);

    // JS changes
    _watch(jsConfig.watch, js);

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
  exports.build = parallel(_html, _css, _js);

  /**************** default task ****************/

  exports.default = series(_css, watch, server)
  // ,syncNPMScript);

})();
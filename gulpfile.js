/* eslint-disable no-undef */
/* BULD HISTORY
   npm install --save-dev gulp gulp-clean-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass gulp-htmlmin del gulp-imagemin
   npm install gulp gulp-newer gulp-imagemin gulp-webp --save-dev
   npm install gulp-htmlclean gulp-noop --save-dev
   npm install gulp-deporder gulp-concat gulp-strip-debug gulp-terser gulp-sourcemaps --save-dev
   npm install gulp-sass gulp-postcss postcss-assets autoprefixer css-mqpacker gulp-clean-css gulp-concat-css cssnano --save-dev
   converted to ESM to support newer packages
*/

// modules
import gulp from 'gulp';
import concat from 'gulp-concat';
import concatcss from 'gulp-concat-css';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import deporder from 'gulp-deporder';
import noop from 'gulp-noop';
import newer from 'gulp-newer';
import size from 'gulp-size';
import imagemin from 'gulp-imagemin';
import htmlclean from 'gulp-htmlclean';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import fileinclude from 'gulp-file-include';
//import sync from 'gulp-npm-script-sync';
import sourcemaps from 'gulp-sourcemaps';
import browsersync from 'browser-sync';
//import webp from 'gulp-webp';

(() => {

  /**************** Gulp.js 4 ESM configuration ****************/
  require = require("esm")(module/*, options*/)
  module.exports = require("./main.js")

  const

    // development or production
    devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development'),

    // directory locations
    dir = {
      src: 'src/',
      build: 'build/'
    }


  console.log('Gulp', devBuild ? 'development' : 'production', 'build');

  /**************** clean task ****************/

  function clean() {

    return del([dir.build], { force: true });

  }

  const wipe = gulp.clean;

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

  function images() {
    return gulp.src(imgConfig.src)
      .pipe(newer(imgConfig.build))
      .pipe(imagemin(imgConfig.minOpts))
      .pipe(size({ showFiles: true }))
      .pipe(gulp.dest(imgConfig.build));
  }


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
  const fileInclude = gulp.series(fileinclude, html)

  // HTML processing
  function html() {
    const out = htmlConfig.build;

    return gulp.src(htmlConfig.src)
      .pipe(newer(out))
      .pipe(devBuild ? noop() : htmlclean())
      .pipe(gulp.dest(out));
  }
  const html = gulp.parallel(images, html);

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

  const css = gulp.series(images, scss, css, cssPrint);

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
    gulp.watch(imgConfig.src, images);

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
  const build = gulp.parallel(html, css, js);

  /**************** default task ****************/

  const dev = gulp.series(html, css, js, watch, server)
  // ,syncNPMScript);

})();

export { clean, wipe, images, css, html, js, build, dev };
export default build;
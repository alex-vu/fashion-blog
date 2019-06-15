const { watch, series, parallel, src, dest, gulp } = require("gulp");
const livereload = require("gulp-livereload"); // Triggers livereload on file changes
const del = require("del"); // Empty folders before compiling
const rename = require("gulp-rename"); // Rename files after compile
const cache = require("gulp-cache"); // A temp file based caching proxy task for gulp.
const uglify = require("gulp-uglify"); // JavaScript Minifier
const terser = require("gulp-terser"); // JavaScript Minifier
const sass = require("gulp-sass"); // Gulp Sass plugin
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css"); // CSS Minifier
const inject = require("gulp-inject"); // Injects CSS/JS into html
const connect = require("gulp-connect"); // Runs a local webserver
const open = require("gulp-open"); // Opens a URL in a web browser

// General Config Vars
const config = {
  port: 8080,
  devBaseUrl: "http://localhost",
  paths: {
    root: "./src/",
    html: "./src/*.html",
    scss: "./src/scss/*.scss",
    scssBase: "./src/scss/base/*.scss",
    scssHelper: "./src/scss/helper/*.scss",
    scssComponent: "./src/scss/components/*.scss",
    scssPages: "./src/scss/pages/*.scss",
    js: "./src/js/*.js",
    dist: "./dist/",
    distCSSDir: "./dist/css/",
    distJSDir: "./dist/js/",
    node_modules: "./node_modules/"
  }
};

let sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};

// Compile SASS files
function scssCompile(done) {
  return src(config.paths.scss)
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(dest(config.paths.distCSSDir));
  done();
}

// Compile any JS files in JS folder
function jsCompile(done) {
  return src(config.paths.js)
    .pipe(terser())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(config.paths.distJSDir));
  done();
}

// Move files to dist
function moveFiles(done) {
  return src(config.paths.html).pipe(dest(config.paths.dist));
  done();
}

// A stylesheet, javascript and webcomponent reference injection plugin for gulp.
// https://www.npmjs.com/package/gulp-inject
function injectFiles(done) {
  var target = src(config.paths.dist + "index.html");
  var sources = src(
    [config.paths.distJSDir + "*.js", config.paths.distCSSDir + "*.css"],
    { read: false }
  );
  return target
    .pipe(inject(sources, { relative: true }))
    .pipe(dest(config.paths.dist))
    .pipe(livereload());
  done();
}

// Launch Chrome web browser
// https://www.npmjs.com/package/gulp-open
function openBrowser(done) {
  var options = {
    uri: "http://localhost:" + config.port,
    app: "Google Chrome"
  };
  return src(config.paths.dist + "index.html").pipe(open(options));
  done();
}

// Gulp plugin to run a webserver (with LiveReload)
// https://www.npmjs.com/package/gulp-connect
function server(done) {
  return new Promise(function(resolve, reject) {
    connect.server({
      root: config.paths.dist,
      port: config.port,
      debug: true
    });
    resolve();
  });
}

// Build Tasks
function buildTasks(done) {
  return series(scssCompile, jsCompile, moveFiles, injectFiles);
  done();
}

// Watch Task
// Gulp will watch all on events with a set delay followed by build task.
function watchTasks(done) {
  return new Promise(function(resolve, reject) {
    watch(
      [
        config.paths.html,
        config.paths.scss,
        config.paths.scssBase,
        config.paths.scssHelper,
        config.paths.scssComponent,
        config.paths.scssPages,
        config.paths.js
      ],
      { events: "all", delay: 200 },
      buildTasks(),
      livereload.listen()
    );
    resolve();
  });
  done();
}

// Empty Folders
/*
Run gulp clean command for a clean slate in dist directory.
You will need to run the command gulp build again to prevent errors.
*/
exports.clean = function(done) {
  clean();
  done();
};

/*
The default gulp command.
*/
exports.default = series(
  scssCompile,
  jsCompile,
  moveFiles,
  injectFiles,
  openBrowser,
  parallel(server, watchTasks)
);

'use strict';

var appName = 'ionicplus';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var beep = require('beepbeep');
var express = require('express');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var preprocess = require('gulp-preprocess');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var ripple = require('ripple-emulator');
var vendorAssets = require('./vendor.json');
var _ = require('lodash');
var imageop = require('gulp-image-optimization');


/**
 * Parse arguments
 */
var args = require('yargs')
    .alias('e', 'emulate')
    .alias('b', 'build')
    .alias('r', 'run')
    // remove all debug messages (console.logs, alerts etc) from release build
    .alias('release', 'strip-debug')
    .default('build', false)
    .default('port', 9000)
    .default('strip-debug', false)
    .argv;


// the source paths
var environment = args.env || 'development';
var _livereload = args.livereload?' --livereload ':'';
var _consolelogs = args.consolelogs?' --consolelogs ':'';
var _device = args.device?' --device ':'';

plugins.util.log('Using Build Target:',environment);

var config = {
  development:'development.config.js',
  production:'production.config.js',
  staging:'staging.config.js'
}

// the source paths
var srcFiles = {
  sass: ['app/modules/**/css/*.scss'],
  css: ['app/modules/**/css/*.css'],
  scripts: ['app/init/env.js','app/init/config/'+config[environment],'app/init/app.js','templates.js','./app/modules/**/*.js'],
  templates: ['app/modules/**/views/*.html'],
  images: ['app/modules/**/img/*.*'],
  fonts:['app/fonts/*.*', 'bower_components/ionic/release/fonts/*.*'],
  icons:['app/icons/**'],
  resources: ['resources/*.png'],
  svg:['app/icons/*.svg'],
  index_page: ['app/main.html'],
  vendorJS:vendorAssets.js,
  vendorCSS:vendorAssets.css,
  vendorSASS:vendorAssets.scss
};
// the destination paths
var destFiles = {
  css: 'css',
  vendorCSS:'lib',
  scripts: 'js',
  vendorJS:'lib',
  templates: 'templates',
  images: 'img',
  fonts:'fonts',
  resources: 'resources',
  index_page: 'main.html',
  root: 'www/',
  release_builds: './release_builds'
};


var build = !!(args.build || args.emulate || args.run);
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var stripDebug = !!args.stripDebug;
var targetDir = path.resolve(build ? 'www' : '.tmp');


// if we just use emualate or run without specifying platform, we assume android
// in this case the value returned from yargs would just be true
if (emulate === true) {
    emulate = 'android';
}

if (run === true) {
    run = 'android';
}

// global error handler
var errorHandler = function(error) {
  if (build) {
    throw error;
  } else {
    beep(2, 170);
    plugins.util.log(error);
  }
};


// clean target dir
gulp.task('clean', function(done) {
  del([targetDir], done);
});

// precompile .scss and concat with ionic.css
gulp.task('css', function() {
  var dest = path.join(targetDir, destFiles.css);
  var options = build ? { style: 'compressed' } : { style: 'expanded' };

  var sassStream = gulp.src(srcFiles.sass)
    .pipe(plugins.sass(options))
    .pipe(plugins.rename({
      dirname:""
    }))
    .pipe(plugins.if(!build, plugins.changed(dest)))
    .on('error', function(err) {
      console.log('err: ', err);
      beep();
    });

  var cssStream = gulp.src(srcFiles.css)
    .pipe(plugins.rename({
      dirname:""
    }))
    .pipe(plugins.if(!build, plugins.changed(dest)))
    .on('error',function(err){
      console.log('err:', err);
      beep();
    });


  return streamqueue({ objectMode: true }, sassStream,cssStream)
    .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
    //.pipe(plugins.concat('app.css'))
    .pipe(plugins.if(build,plugins.concat('app.css')))
    .pipe(plugins.if(build, plugins.stripCssComments()))
    .pipe(plugins.if(build && !(emulate || _livereload), plugins.rev()))
    .pipe(gulp.dest(dest))
    .on('error', errorHandler);
});


// build templatecache, copy scripts.
// if build: concat, minsafe, uglify and versionize
gulp.task('scripts', function() {
  var dest = path.join(targetDir, destFiles.scripts);

  var minifyConfig = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeComments: true
  };

  // prepare angular template cache from html templates
  // (remember to change appName var to desired module name)
  var templateStream = gulp
    .src(srcFiles.templates)
    .pipe(plugins.angularTemplatecache('templates.js', {
      root: 'modules/',
      module: appName,
      htmlmin: build && minifyConfig
    }));

  var scriptStream = gulp
    .src(srcFiles.scripts)
    .pipe(preprocess({context: { BUILD_TARGET: environment}}))
    .pipe(plugins.if(!build, plugins.changed(dest)));

  return streamqueue({ objectMode: true }, scriptStream, templateStream)
    .pipe(plugins.if(build, plugins.ngAnnotate()))
    .pipe(plugins.if(stripDebug, plugins.stripDebug()))
    .pipe(plugins.if(build, plugins.concat('app.js')))
    .pipe(plugins.if(build, plugins.uglify())) //comment this line if debugging is required
    .pipe(plugins.if(build && !(emulate || _livereload), plugins.rev())) //comment this line if debugging is requried
    .pipe(gulp.dest(dest))
    .on('error', errorHandler);
});

// copy fonts
gulp.task('fonts', function() {
  return gulp
    .src(srcFiles.fonts)
    .pipe(gulp.dest(path.join(targetDir, destFiles.fonts)))

    .on('error', errorHandler);
});


// copy templates
gulp.task('templates', function() {
  return gulp.src(srcFiles.templates)
    .pipe(preprocess({context: { BUILD_TARGET: config[environment]}}))
    .pipe(gulp.dest(path.join(targetDir, destFiles.templates)))

    .on('error', errorHandler);
});

// generate iconfont
gulp.task('iconfont', function(){
  return gulp.src(srcFiles.svg, {
        buffer: false
    })
    .pipe(plugins.iconfontCss({
      fontName: 'ownIconFont',
      path: 'app/icons/own-icons-template.css',
      targetPath: '../css/own-icons.css',
      fontPath: '../fonts/'
    }))
    .pipe(plugins.iconfont({
        fontName: 'ownIconFont'
    }))
    .pipe(gulp.dest(path.join(targetDir, destFiles.fonts)))
    .on('error', errorHandler);
});

// copy images
gulp.task('images', function() {
  return gulp.src(srcFiles.images)
    .pipe(plugins.rename({
      dirname:""
    }))
    /*.pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))*/
    .pipe(gulp.dest(path.join(targetDir, destFiles.images)))

    .on('error', errorHandler);
});


// lint js sources based on .jshintrc ruleset
gulp.task('jsHint', function(done) {
  return gulp
    .src(srcFiles.scripts)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))

    .on('error', errorHandler);
    done();
});

// concatenate and minify vendor sources
gulp.task('vendorJS', function() {
  var dest = path.join(targetDir, destFiles.vendorJS);

  return gulp.src(srcFiles.vendorJS)
    .pipe(plugins.if(build, plugins.concat('vendor.js')))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build, plugins.rev()))

    .pipe(gulp.dest(dest))

    .on('error', errorHandler);
});


// concatenate and minify vendor sources
gulp.task('vendorCSS', function() {

    var dest = path.join(targetDir, destFiles.vendorCSS);
    var options = build ? { style: 'compressed' } : { style: 'expanded' };


    var vendorCSSStream = gulp.src(srcFiles.vendorCSS)
      .pipe(plugins.if(!build, plugins.changed(dest)))
      .pipe(plugins.rename({
        dirname:""
       }))
      .on('error',function(err){
        console.log('err:', err);
        beep();
      });
    // build ionic css dynamically to support custom themes
    var vendorSASSStream = gulp.src(srcFiles.vendorSASS)
      .pipe(plugins.cached('ionic-styles'))
      .pipe(plugins.sass(options))
      .pipe(plugins.if(!build, plugins.changed(dest)))
      // cache and remember ionic .scss in order to cut down re-compile time
      .pipe(plugins.remember('ionic-styles'))
      .on('error', function(err) {
          console.log('err: ', err);
          beep();
        });

    return streamqueue({ objectMode: true },vendorSASSStream, vendorCSSStream)
      .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
      //.pipe(plugins.concat('vendor.css'))
      .pipe(plugins.if(build,plugins.concat('vendor.css')))
      .pipe(plugins.if(build, plugins.stripCssComments()))
      .pipe(plugins.if(build && !(emulate || _livereload), plugins.rev()))
      .pipe(gulp.dest(dest))
      .on('error', errorHandler);



});


// inject the files in main.html
gulp.task('index', ['jsHint', 'scripts'], function() {

  // build has a '-versionnumber' suffix
  var cssNaming = destFiles.css + '/app*';
  var vendorCSSNaming = destFiles.vendorCSS + '/*.css';
  var vendorJSNaming = destFiles.vendorJS + '/*.js';
  // injects 'src' into main.html at position 'tag'
  var _inject = function(src, tag) {
    return plugins.inject(src, {
      starttag: '<!-- inject:' + tag + ':{{ext}} -->',
      read: false,
      addRootSlash: false
    });
  };

  // get all our javascript sources
  // in development mode, it's better to add each file seperately.
  // it makes debugging easier.
  var _getAllScriptSources = function() {
    var destJS = destFiles.scripts;
    var scriptStream = gulp.src([destJS + '/env.js',destJS + '/'+config[environment],destJS + '/app.js', destJS + '/**/*.js'], { cwd: targetDir });
    return streamqueue({ objectMode: true }, scriptStream);
  };

  var _getAllVendorJSSources = function() {
    var vendorJSFiles = [];
    _.each(srcFiles.vendorJS,function(file){
      var fileComponents = file.split('/');
      var fileName = fileComponents[fileComponents.length - 1];
      vendorJSFiles.push(destFiles.vendorJS + '/'+fileName);

    });
    var scriptStream = gulp.src(vendorJSFiles, { cwd: targetDir });
    return streamqueue({ objectMode: true }, scriptStream);
  };

  var _getAllCSSSources = function() {
    var cssStream = gulp.src([destFiles.css + '/*.css'], { cwd: targetDir });
    return streamqueue({ objectMode: true }, cssStream);
  }

  var _getAllVendorCSSSources = function() {
    var vendorCSSFiles = [];
    _.each(srcFiles.vendorSASS,function(file){
      var fileComponents = file.split('/');
      var fileName = fileComponents[fileComponents.length - 1].split('.')[0];
      vendorCSSFiles.push(destFiles.vendorCSS + '/'+fileName + '.css');

    });
    _.each(srcFiles.vendorCSS,function(file){
      var fileComponents = file.split('/');
      var fileName = fileComponents[fileComponents.length - 1];
      vendorCSSFiles.push(destFiles.vendorCSS + '/'+fileName);

    });

    var vendorCSSStream = gulp.src(vendorCSSFiles, { cwd: targetDir });
    return streamqueue({ objectMode: true }, vendorCSSStream);
  }
  gulp.src('app/index.html')
      .pipe(gulp.dest(targetDir));

  return gulp.src('app/main.html')
    // inject css
    .pipe(plugins.if(build,
      _inject(gulp.src(cssNaming, { cwd: targetDir }), 'app-styles'),
      _inject(_getAllCSSSources(), 'app-styles')
    ))
    .pipe(plugins.if(build,
      _inject(gulp.src(vendorCSSNaming, { cwd: targetDir }), 'vendor-styles'),
      _inject(_getAllVendorCSSSources(), 'vendor-styles')
    ))

    /*
    .pipe(_inject(gulp.src(cssNaming, { cwd: targetDir }), 'app-styles'))
    .pipe(_inject(gulp.src(vendorCSSNaming, { cwd: targetDir }), 'vendor-styles'))
    */
    // inject vendor.js
    .pipe(plugins.if(build,
      _inject(gulp.src(vendorJSNaming, { cwd: targetDir }), 'vendor'),
      _inject(_getAllVendorJSSources(),'vendor')
    ))
    // inject app.js (build) or all js files indivually (dev)
    .pipe(plugins.if(build,
      _inject(gulp.src(destFiles.scripts +  '/app*.js', { cwd: targetDir }), 'app'),
      _inject(_getAllScriptSources(), 'app')
    ))

    .pipe(gulp.dest(targetDir))
    .on('error', errorHandler);
});

// start local express server
gulp.task('serve', function() {
  var app = express();
    app.use(!build ? connectLr() : function(){});
    app.use(express.static(targetDir));
    app.listen(port);

  open('http://localhost:' + port + '/');
});

// ionic emulate wrapper
gulp.task('ionic:emulate', plugins.shell.task([
  'ionic emulate ' + emulate + ' --livereload --consolelogs'
]));

// ionic run wrapper
gulp.task('ionic:run', plugins.shell.task([
  'ionic run ' + run + _device + _livereload + _consolelogs
]));

// ionic resources wrapper
gulp.task('icon', plugins.shell.task([
  'ionic resources --icon'
]));
gulp.task('splash', plugins.shell.task([
  'ionic resources --splash'
]));
gulp.task('resources', plugins.shell.task([
  'ionic resources'
]));

// select emulator device
gulp.task('select', plugins.shell.task([
  './helpers/emulateios'
]));

// ripple emulator
gulp.task('ripple', ['scripts', 'css', 'watchers'], function() {

  var options = {
    keepAlive: false,
    open: true,
    port: 4400
  };

  // Start the ripple server
  ripple.emulate.start(options);

  open('http://localhost:' + options.port + '?enableripple=true');
});


// start watchers
gulp.task('watchers', function() {
  plugins.livereload.listen();
  gulp.watch(srcFiles.css, ['css','index']);
  gulp.watch(srcFiles.sass, ['css','index']);
  gulp.watch(srcFiles.fonts, ['fonts']);
  gulp.watch(srcFiles.icons, ['iconfont']);
  gulp.watch(srcFiles.images, ['images']);
  gulp.watch(srcFiles.scripts, ['index']);
  gulp.watch(srcFiles.templates, ['index']);
  gulp.watch(srcFiles.index_page, ['index']);
  gulp.watch(srcFiles.vendorJS, ['vendorJS','index']);
  gulp.watch(srcFiles.vendorCSS, ['vendorCSS','index']);
  gulp.watch(srcFiles.vendorSCSS, ['vendorCSS','index']);
  gulp.watch(targetDir + '/**')
    .on('change', plugins.livereload.changed)
    .on('error', errorHandler);
});

// no-op = empty function
gulp.task('noop', function() {});

// our main sequence, with some conditional jobs depending on params
gulp.task('default', function(done) {
  runSequence(
    'clean',
    'iconfont',
    [
      'fonts',
      'templates',
      'css',
      'vendorCSS',
      'images',
      'vendorJS'
    ],
    'index',
    build ? 'noop' : 'watchers',
    build ? 'noop' : 'serve',
    emulate ? ['ionic:emulate', 'watchers'] : 'noop',
    run ? ['ionic:run',_livereload?'watchers':'noop'] : 'noop',
    done);
});

gulp.task('build', function(done) {
  build=true;
  targetDir = path.resolve(build ? 'www' : '.tmp');
  runSequence(
    'clean',
    'iconfont',
    [
      'fonts',
      'templates',
      'css',
      'vendorCSS',
      'images',
      'vendorJS'
    ],
    'index',
    done);
});

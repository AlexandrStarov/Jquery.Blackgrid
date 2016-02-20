/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  concat = require("gulp-concat"),
  del = require("del"),
  //minifyCss = require("gulp-minify-css"),
  rename = require("gulp-rename"),
  runSequence = require("run-sequence"),
  sass = require("gulp-sass"),
  tsc = require("gulp-tsc"),
  uglify = require("gulp-uglify");

var paths = {
    shared: {
        bower: {
            src: "bower_components",
            dest: "wwwroot/lib"
        }
    }
}

// lib
gulp.task(
  "lib", function (cb) {
      runSequence("lib-clean", "lib-copy", cb);
  }
);

gulp.task(
  "lib-clean", function (cb) {
      del(paths.shared.bower.dest + "/*", cb);
  }
);

gulp.task(
  "lib-copy:js", function (cb) {
      var lib = {
          "/jquery": "/jquery/dist/jquery*.{js,map}",
          "/jquery-validation": "/jquery-validation/dist/jquery.validate*.js",
          "/jquery-validation-unobtrusive": "/jquery-validation-unobtrusive/jquery.validate.unobtrusive*.js",
          "/bootstrap/js": "/bootstrap/dist/js/bootstrap*.js",
          "/bootstrap/css": "/bootstrap/dist/css/bootstrap*.css",
          "/bootstrap/fonts": "/bootstrap/fonts/*",
          "/font-awesome/css": "/font-awesome/css/font-awesome*.css",
          "/font-awesome/fonts": "/font-awesome/fonts/*"
      };


      for (var $package in lib) {
          gulp
            .src(paths.shared.bower.src + lib[$package])
            .pipe(gulp.dest(paths.shared.bower.dest + $package));
      }

      //cb();
  }
);


//var gulp = require("gulp"),
//    rimraf = require("rimraf"),
//    concat = require("gulp-concat"),
//    cssmin = require("gulp-cssmin"),
//    uglify = require("gulp-uglify");

//var paths = {
//    webroot: "./wwwroot/"
//};

//paths.js = paths.webroot + "js/**/*.js";
//paths.minJs = paths.webroot + "js/**/*.min.js";
//paths.css = paths.webroot + "css/**/*.css";
//paths.minCss = paths.webroot + "css/**/*.min.css";
//paths.concatJsDest = paths.webroot + "js/site.min.js";
//paths.concatCssDest = paths.webroot + "css/site.min.css";

//gulp.task("clean:js", function (cb) {
//    rimraf(paths.concatJsDest, cb);
//});

//gulp.task("clean:css", function (cb) {
//    rimraf(paths.concatCssDest, cb);
//});

//gulp.task("clean", ["clean:js", "clean:css"]);

//gulp.task("min:js", function () {
//    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
//        .pipe(concat(paths.concatJsDest))
//        .pipe(uglify())
//        .pipe(gulp.dest("."));
//});

//gulp.task("min:css", function () {
//    return gulp.src([paths.css, "!" + paths.minCss])
//        .pipe(concat(paths.concatCssDest))
//        .pipe(cssmin())
//        .pipe(gulp.dest("."));
//});

//gulp.task("min", ["min:js", "min:css"]);

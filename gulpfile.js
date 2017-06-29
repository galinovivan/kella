'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    sorceMaps = require('gulp-sourcemaps'),
    cssMin = require('gulp-minify-css'),
    imageMin = require('gulp-imagemin'),
    pngQuant = require('imagemin-pngquant'),
    sass = require('gulp-sass'),
    autofrefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat');




var path = {
  build: {
      css: 'assets/css/',
      js: 'assets/scripts/dist/'
  },
  src: {
      style: 'assets/styles/common.scss',
      js: 'assets/scripts/*.js'
  }
};


var config = {
    server: {
        baseDir: '/assets/'
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};


gulp.task('style:build', function() {
   gulp.src(path.src.style)
       .pipe(sorceMaps.init())
       .pipe(sass())
       .pipe(autofrefixer())
       .pipe(cssMin())
       .pipe(sorceMaps.write())
       .pipe(gulp.dest(path.build.css))
});

gulp.task('js:build', function() {
   gulp.src(path.src.js)
       .pipe(sorceMaps.init())
       .pipe(concat('scripts.js'))
       .pipe(uglify())
       .pipe(sorceMaps.write())
       .pipe(gulp.dest(path.build.js))
});


gulp.task('watch', function() {
    watch([path.src.js], function(event, cb) {
        gulp.start('js:build');
    })
});
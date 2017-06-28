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
      css: 'assets/css'
  },
  src: {
      style: 'assets/styles/common.scss'
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


gulp.task('watch', function() {
    watch([path.watch.style], function(event, cb) {
       gulp.start('style:build');
    });
});
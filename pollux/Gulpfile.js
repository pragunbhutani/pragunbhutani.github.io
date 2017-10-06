var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

// Process SASS
gulp.task('styles', function() {
  gulp.src('./sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('final.css'))
    .pipe(gulp.dest('./assets/css/'));
});

// Watch
gulp.task('default',function() {
  gulp.watch('sass/**/*.scss', ['styles']);
});
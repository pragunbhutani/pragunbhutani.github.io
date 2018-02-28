var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');

/* CONFIG */
var entryPoint = './src/main.js';
var broswerDir = './';
var styleWatchPath = './styles/**/*.scss';
var jsWatchPath = './src/**/*.js';
var htmlWatchPath = './**/*.html';

/* TASKS */
gulp.task('js', function() {
	return browserify(entryPoint, { debug: true, extensions: ['es6'] })
		.transform('babelify', { presets: ['es2015'] })
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
	  .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function () {
  const config = {
    server: { baseDir: browserDir }
  };

  return browserSync(config);
});

gulp.task('sass', function () {
  return gulp.src(sassWatchPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', function () {
  gulp.watch(jsWatchPath, ['js']);
  gulp.watch(sassWatchPath, ['sass']);
  gulp.watch(htmlWatchPath, function () {
      return gulp.src('')
          .pipe(browserSync.reload({ stream: true }))
  });
});

gulp.task('run', ['js', 'sass', 'watch', 'browser-sync']);
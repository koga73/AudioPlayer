var gulp = require('gulp');
var sass = require('gulp-sass');
/*var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');*/

gulp.task('sass', function (done) {
	gulp.src('./css/*.scss')
		.pipe(sass({
			errLogToConsole:true
		}))
		.pipe(gulp.dest('./css/'))
		/*.pipe(minifyCss({keepSpecialComments:0}))
		.pipe(rename({extname: '.min.css'}))*/
		.pipe(gulp.dest('./css/'))
		.on('end', done);
});

gulp.task('watch', function () {
	gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
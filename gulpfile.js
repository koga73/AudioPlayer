var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function (done) {
	gulp.src('./css/*.scss')
		.pipe(sass({
			errLogToConsole:true
		}))
		.pipe(gulp.dest('./css/'))
		.on('end', done);
});

gulp.task('watch', function () {
	gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
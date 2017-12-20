var gulp = require('gulp'),
	sass = require('gulp-sass'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	sourcemaps = require('gulp-sourcemaps'),
	sourcemapsupport = require('gulp-sourcemaps-support'),
	uglify = require('gulp-uglify'),
	gutil = require("gulp-util"),
	bourbon = require("node-bourbon").includePaths,
	neat = require('node-neat').includePaths,
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	minimist = require("minimist"),
	jshint = require('gulp-jshint'),
	rm = require('gulp-rimraf');

var opts = {
	default: {
		dest: 'dist',
		asset: '/assets'
	}
};

var argv = minimist(process.argv.slice(2), opts);

console.dir(argv);

gulp.task('clean', function() {
	gulp.src(argv.dest + '/*').pipe(rm());
});

// Lint Task
gulp.task('lint', function() {
	return gulp.src('src/main/frontend/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
	var processors = [
		autoprefixer({
			browsers: ['last 3 version']
		}),
		cssnano()
	];
	return gulp.src('src/main/frontend/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [].concat(bourbon, neat)
		}).on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(argv.dest + argv.asset + '/css/'
		));
});

gulp.task('javascripts', function() {
	return gulp.src(['src/main/frontend/js/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('all.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(argv.dest + argv.asset + '/js/'));
});

gulp.task('vendorsJs', function() {
	return gulp.src(['node_modules/jquery/dist/jquery.js'])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('vendors.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(argv.dest + argv.asset + '/js/'));
});

// Watch task
gulp.task('default', function() {
	gulp.watch('src/main/frontend/scss/**/*.scss', ['styles']);
	gulp.watch('src/main/frontend/js/**/*.js', ['lint', 'javascripts']);
	gulp.start('styles', 'lint', 'javascripts', 'vendorsJs');
});

// build task
gulp.task('build', function() {
	gulp.start('styles', 'lint', 'javascripts', 'vendorsJs');
});

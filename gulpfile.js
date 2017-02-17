var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglifyjs');
var del          = require('del');
var minifyCss    = require('gulp-minify-css');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
var cache        = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');

// gulp.task('mytask', function(){
// 	return gulp.src('source-files')
// 	.pipe(plugin())
// 	.pipe(gulp.dest('folder'))
// })



gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], { cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});


gulp.task('scripts', function(){
	return gulp.src('app/libs/jquery/dist/jquery.min.js')
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'))
});



gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir:'app'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');

});
gulp.task('clear', function(){
	return cache.clearAll();

});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'))

});

gulp.task('watch',['browser-sync', 'sass', 'scripts'], function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build',['clean','img', 'sass', 'scripts'], function(){

	var buildCss = gulp.src('app/css/main.css')
	.pipe(minifyCss())
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var minJs = gulp.src('app/js/common.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));

	var builJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));



});
/**
 * Created by diwu on 4/18/15.
 */
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var noop = function () {};
var git = require('gulp-git');
var stylish = require('gulp-jscs-stylish');
var gulp = require('gulp');
gulp.task('lint', function () {
	gulp.src([ '**.js' ])
		.pipe(jshint())                           
		.pipe(jscs())                             
		.on('error', noop)                        
		.pipe(stylish.combineWithHintResults())   
		.pipe(jshint.reporter('jshint-stylish')); 
});

gulp.task('build', ['lint'], function() {
	gulp.src('/')
		//pipe through other tasks such as sass or coffee compile tasks
		.pipe(notify({
			title: 'Task Builder',
			message: 'Successfully built application'
		}))
});

/**
 * Release Tasks
 */

gulp.task('publish:tag', function(done) {
	var pkg = JSON.parse(require('fs').readFileSync('./package.json'));
	var v = 'v' + pkg.version;
	var message = 'Release ' + v;

	git.tag(v, message, function (err) {
		if (err) throw err;
		git.push('origin', v, function (err) {
			if (err) throw err;
			done();
		});
	});
});

gulp.task('publish:npm', function(done) {
	require('child_process')
		.spawn('npm', ['publish'], { stdio: 'inherit' })
		.on('close', done);
});

gulp.task('release', ['publish:tag']);

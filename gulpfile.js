var gulp = require('gulp'),
livereload = require('gulp-livereload'); // Requiring gulp-livereload task.
function errorLog(error) {
  console.error(error);
  this.emit('end');
}

/* -- JSHINT ---- */
var jshint = require('gulp-jshint');
gulp.task('jshint', function() {
  return gulp.src('./app/*/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/* -- JSCS ---- */
var file = 'models/data.js';
var jscs = require('gulp-jscs');
gulp.task('jscs', function () {
    return gulp.src('./app/' + file)
        .pipe(jscs({
            //fix: true,
            preset : 'node-style-guide'
        }))
        .pipe(gulp.dest('./app/models'));;
});

// --------------------------------------------------
// Build resources - JS and CSS
var shell = require('gulp-shell');
gulp.task('build', function(){
  var stream = gulp.src('public/')
  .pipe(shell([
    'node build/r.js -o build/build.js optimize=none'
    ]))
    .pipe(livereload());
	return stream;
});
//Run server after running the build - to make it serial
gulp.task('server', ['build'], shell.task([
  'killall node &',//kill other previous node process
  "sudo lsof -i TCP:27017 | grep LISTEN | awk '{print $2}' | sudo xargs kill -9",//Kill mongodb
  'sudo mongod --dbpath ./logs/mongo/db  --fork --logpath ./logs/mongo/mongod.log',//start mongodb
  'forever -o out.log -e err.log --watchDirectory app --watch -c "node -r dotenv/config --debug" server.js'
]))

// gulp.task('server', ['build'], shell.task([
//   'node server.js'
// ]))

// Watch Task
// Watches JS
gulp.task('watch', function () {
  livereload.listen(); // Calling lister on livereload task, which will start listening for livereload client.
  gulp.watch(['public/res/**/*', '!public/res/uploads'], ['build']);
  // gulp.watch('public/res/js/**/*.js', ['build']);
  //gulp.watch('public/res/css/**/*.css', ['build']);
  //gulp.watch('public/res/js/**/*.html', ['build']);
});
// gulp.task('default', ['uploadJS', 'uploadCSS']);
gulp.task('default', ['watch', 'server']);

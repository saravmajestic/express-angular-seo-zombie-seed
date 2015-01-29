var gulp = require('gulp'),
livereload = require('gulp-livereload'); // Requiring gulp-livereload task.
function errorLog(error) {
  console.error(error);
  this.emit('end');
}

// Scripts Task
// Uglify
var uploadFn = function (dirPath) {
  try{
    var ENV = "development";
    var app_config = require(__dirname + '/config/'+ENV+'/app.json');
    var service_account_name = app_config.google.service_account_name;
    var key_file_location = ROOT_PATH + '/keys/google/' + app_config.google.key;

    var CloudStorage = require('cloud-storage');
    var storage = new CloudStorage({
      accessId: service_account_name,
      privateKey: key_file_location
    });
    var currentDate = new Date();
    currentDate.setYear(2020);
    // if you want to get crazy you can pass in options and metadata
    var options = {
      headers: {
        'Cache-Control': 'public,max-age=31556940',
        'X-Goog-Acl': 'public-read'
      },
      metadata: {
        'expires': currentDate
      },

      // force an extension to be added to the destination
      forceExtension: true
    };

    var fs = require('fs');
    var async = require('async');
    var version = "0.1";

    var files = fs.readdirSync(__dirname + '/dist/' + dirPath);
    async.eachSeries(files, function(file, callback){
      console.log("Uploading file: " + (__dirname + '/dist/'+dirPath+'/' + file));
      storage.copy(__dirname + '/dist/'+dirPath+'/' + file, 'gs://'+app_config.google.bucket+'/'+version+'/'+dirPath+'/'+ file, options, function(err, url) {
        if(err)
          console.log(err);
        else
          console.log("Upload completed: " + (__dirname + '/dist/'+dirPath+'/' + file));
        callback();
      });
    }, function(err){
      if(err)
      console.log("Error: ", err);
    });

    }catch(err){
      if(err)
      console.log("Error: ", err);
    }
  };
gulp.task('uploadJS', function(){
  uploadFn('js');
});
gulp.task('uploadCSS', function(){
  uploadFn('css');
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
  'node --debug server'
]))

// Watch Task
// Watches JS
gulp.task('watch', function () {
  livereload.listen(); // Calling lister on livereload task, which will start listening for livereload client.
  gulp.watch('public/res/**/*', ['build']);
  // gulp.watch('public/res/js/**/*.js', ['build']);
  //gulp.watch('public/res/css/**/*.css', ['build']);
  //gulp.watch('public/res/js/**/*.html', ['build']);
});
// gulp.task('default', ['uploadJS', 'uploadCSS']);
gulp.task('default', ['build', 'server', 'watch']);

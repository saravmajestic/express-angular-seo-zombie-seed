exports.slugSession = function(text){
    return text
        .replace(/\./g,'')
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '');
};
/**
 * Capitalize the first character of a string
 */
exports.capitaliseFirstLetter = function(string) {
    if(string)
        return string.charAt(0).toUpperCase() + string.slice(1);
    else {
        return "";
    }
};

exports.getExpiresDate = function(){
    return new Date();
}

/* Date Formatter */
exports.dateFormat = function (date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}

/*Get distinct values in array*/
exports.getUnique = function(arr){
   var u = {}, a = [];
   for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
}
exports.removeFromArray = function(array, element){
	if(!array || !element){
		return;
	}
	var index = array.indexOf(element);
	array.splice(index, 1);
	return array;
};

exports.sortArray = function(array, key, isDesc){
  array.sort(function(a, b){
        if (parseInt(a[key]) < parseInt(b[key])) {
            return isDesc ? 1 : -1;
          }
          if (parseInt(a[key]) > parseInt(b[key])) {
            return isDesc ? -1 : 1;
          }
          // a must be equal to b
          return 0;
      });
};

exports.saveFile = function(imageData, fileName, fileDirPath, callback){
  var imageArray = imageData.split('base64,');
  var base64Data = imageArray[1];
  
  var fileName = fileName;
  var fileNameArray = fileName.split(".");
  var extn = fileNameArray[fileNameArray.length - 1];

  var uploadRootPath = DATA_DIR + app_config.uploadPath;
  
  var fileUploadPath = uploadRootPath + fileDirPath,
    finalFileName = Math.random().toString(36).substr(2, 5) + "." + extn;

  logger.info("Saving file: in path: %s/%s" ,fileUploadPath, finalFileName);
  var fx = require("fs-extra");
    fx.outputFile(fileUploadPath + finalFileName, base64Data, 'base64', function(err) {

    //This code is not working with OPENSHIFT yet!
    //Compress the jpeg files  
    if(extn == 'jpg' || extn == 'jpeg'){
    var Imagemin = require('./imageMin');
    var imageminJpegRecompress = require('imagemin-jpeg-recompress');
    new Imagemin()
      .src((fileUploadPath + finalFileName))
      .dest((fileUploadPath))
      .use(imageminJpegRecompress({loops: 3}))
      .run(function(err, newImage){
        if(err){
          logger.error("Not able to recompress the image: ", err.message, err, (fileUploadPath + finalFileName));
        }
saveFileAfterCompression(err, finalFileName, fileDirPath, callback, fileUploadPath);
      
});
    }else{
      saveFileAfterCompression(err, finalFileName, fileDirPath, callback, fileUploadPath);
    }
    });

};

function saveFileAfterCompression(err, finalFileName, fileDirPath, callback, fileUploadPath){
  //Handle if you have to upload to CDN here
  callback(err, finalFileName);
}
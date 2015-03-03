'use strict';

var fs = require('fs');


module.exports = {

  copyThis: function(oldFile, newFile){
    fs.createReadStream( oldFile ).pipe( fs.createWriteStream( newFile ) );
  },
  changeBowerInstallLocation: function(file){
    fs.readFile(file, 'utf8', function(err,data){
      if(err){
        loggit(err,'red','!');
        return;
      }
      var result = data.replace( /lib_tmp/g, 'lib' );

      fs.writeFile(file, result, 'utf8', function(err){
        if(err){
          loggit(err,'red','!');
          return;
        }
      });
    });
  }

};

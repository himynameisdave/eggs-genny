'use strict';
var util   = require('util'),
    path   = require('path'),
    yeoman = require('yeoman-generator'),
    yosay  = require('yosay'),
    chalk  = require( "chalk" ),
    del    = require('del'),
    fs     = require('fs'),
    banner = require('./banner.js'),
    //  A simple copy function that uses streams
    copIt  = function( oldFile, newFile ){
      // console.log( chalk.yellow( "Copying "+oldFile+" over to "+newFile ) );
      fs.createReadStream( oldFile ).pipe( fs.createWriteStream( newFile ) );
    },
    //  Dead simple logging
    loggit = function(msg, color){
      if(typeof color === "undefined"){ var color = 'blue'; }
      var printThis = "=================================================\n"+msg+
                      "\n================================================="
      console.log( chalk[color]( printThis ) );
    }

var EggsGennyGenerator = yeoman.generators.Base.extend({
    promptUser: function() {
        var done = this.async();

        // have our banner greet the user
        console.log( banner );

        //  PROMPT USER TO FIGURE OUT WHAT DEPENDENCIES TO JAM IN THERE
        var prompts = [
            {
                name:    "greeting",
                type:    "list",
                message: "First off, let's personalize things! Which do you prefer?",
                choices: [ "sir", "ma'am", "cap'n", "homie", "hombre" ],
                default: "sir"
            },
            {
                name:    "name",
                message: "Now what did you say you were callin' this thing?",
                default: "egg"
            },{
                name:    "desc",
                message: "Care to describe this application of yours?",
                default: "Totally awesome rad app!"
            },{
                name:    "jquery",
                type:    "confirm",
                message: "Y'all need some jQuery?",
                default: true
            },{
                name:    "angular",
                type:    "confirm",
                message: "Y'all need some Angular?",
                default: true
            },{
                name:    "gsap",
                type:    "confirm",
                message: "Y'all need some GSAP?",
                default: true
            },{
                name:    "bootstrap",
                type:    "confirm",
                message: "Y'all need some Bootstrap CSS?",
                default: true
            }
        ];

        this.prompt(prompts, function (props) {

            this.userInputs = props,
            this.appName = props.name;
            this.desc = props.desc;
            this.greeting = props.greeting;

            done();
        }.bind(this));
    }, // end promptUser function
    scaffold: function(){
        // for easier reffing
        var UI     = this.userInputs,
            greeting = this.greeting,
            testString = 'Building you a sweet app with the following deps:';

        //  Make a coolass string to tell the user what they agreed to install
        if( UI.jquery ){ testString += '\n\t- jQuery' }
        if( UI.angular ){ testString += '\n\t- Angular' }
        if( UI.gsap ){ testString += '\n\t- GSAP' }
        if( UI.bootstrap ){ testString += '\n\t- Bootstrap' }

        //  in case they're going bareback
        if( !UI.jquery && !UI.angular && !UI.gsap && !UI.bootstrap ){
            testString += '\n\t<no dependencies>'
            loggit( testString );
            loggit( 'Looks like someone\'s going bareback! YEEE HAWWW!', 'red' );
        }else{
          loggit( testString );
        }

    //  Make some directories
      loggit( "Building Your Directories, "+greeting, 'green' )
        //  app/ directories
        this.mkdir("app");
        this.mkdir("app/css");
        this.mkdir("app/js");
        this.mkdir("app/img");
        this.mkdir("app/lib");
        if( UI.angular ){
            this.mkdir("app/partials");
        }

        this.mkdir("build");


    },
    copyFiles: function(){

        //  Some context for things that need templating
        var ctxt = {
                appName: this.appName,
                appDesc: this.desc,
                greeting: this.greeting,
                deps: this.userInputs
            };

        //  bowerstuffs
        this.copy( '_.bowerrc', '.bowerrc' );

        //  template out the bower.json
        this.template( '_bower.json', 'bower.json', ctxt );

        //  copy over style.less
        this.copy( 'app/css/_style.less', 'app/css/style.less' );

        //  package.json && gulpfile.js
        if( this.userInputs.angular ){
            this.template('_package.ang.json', "package.json", ctxt);
            this.copy( 'app/js/_app.ang.js', 'app/js/app.js' );
        }else{
            this.template('_package.json', "package.json", ctxt);
            this.copy( 'app/js/_app.js', 'app/js/app.js' );
        }

        //  template out the gulp
        this.template( '_gulpfile.js', 'gulpfile.js', ctxt );
        //  main html file
        this.template('app/_index.html', "app/index.html", ctxt);

    },
    bower: function(){
        //  Becuase Lesslie is always a dependancy
        var dependencies = [ 'lesslie' ],
            greeting       = this.greeting,
            userInputs   = this.userInputs;
            // done = this.async();

        //  Add needed deps to the list
        if( userInputs.jquery ){ dependencies.push('jquery'); }
        if( userInputs.angular ){ dependencies.push('angular'); }
        if( userInputs.gsap ){ dependencies.push('gsap'); }
        if( userInputs.bootstrap ){ dependencies.push('bootstrap'); }

        //  Actually do our bower install
        this.bowerInstall(
                dependencies,
                { 'saveDev': true },
                function(){
                    loggit( "Bower dependencies installed, "+greeting+"!",'magenta' );

                    //  CLEANUP SOME app/lib/ stuff
                    copIt( 'app/lib_tmp/lesslie/dist/lesslie.less', 'app/lib/lesslie.less' );

                    if( userInputs.jquery ){
                        copIt( 'app/lib_tmp/jquery/dist/jquery.js', 'app/lib/jquery.js' );
                    }
                    if( userInputs.angular ){
                        copIt( 'app/lib_tmp/angular/angular.js', 'app/lib/angular.js' );
                    }
                    if( userInputs.gsap ){
                        copIt( 'app/lib_tmp/gsap/src/uncompressed/TweenMax.js', 'app/lib/TweenMax.js' );
                        copIt( 'app/lib_tmp/gsap/src/uncompressed/TimelineMax.js', 'app/lib/TimelineMax.js' );
                        copIt( 'app/lib_tmp/gsap/src/uncompressed/plugins/CSSPlugin.js', 'app/lib/CSSPlugin.js' );
                        copIt( 'app/lib_tmp/gsap/src/uncompressed/easing/EasePack.js', 'app/lib/EasePack.js' );
                    }
                    if( userInputs.bootstrap ){
                        copIt( 'app/lib_tmp/bootstrap/dist/css/bootstrap.css', 'app/lib/bootstrap.css' );
                    }

                    del(['app/lib_tmp/'], function (err, deletedFiles) {
                        console.log('Files deleted:', deletedFiles.join(', '));
                    });

                    // done();
                }
            );

    },
    npm: function(){
        var greeting = this.greeting;
        this.npmInstall( '', function(){
          loggit( "NPM modules installed, "+greeting+"!",'magenta' );
          console.log("\n\n\n\n\n");
          loggit( "Your eggs are ready, "+greeting+"!\n   Happy Daveloping!",'green' );
          console.log("\n");
          // done();
        });
    }

});

module.exports = EggsGennyGenerator;

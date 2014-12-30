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
    dCopy  = function( oldFile, newFile ){
      // console.log( chalk.yellow( "Copying "+oldFile+" over to "+newFile ) );
      fs.createReadStream( oldFile ).pipe( fs.createWriteStream( newFile ) );
    }

var EggsGennyGenerator = yeoman.generators.Base.extend({
    promptUser: function() {
        var done = this.async();

        // have our banner greet the user
        console.log( banner );

        //  PROMPT USER TO FIGURE OUT WHAT DEPENDENCIES TO JAM IN THERE
        var prompts = [
            {
                name:    "gender",
                type:    "list",
                message: "First off, let's personalize things! Which do you prefer?",
                choices: [ "sir", "ma'am", "cap'n", "homie" ],
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
            this.gender = props.gender;

            done();
        }.bind(this));
    }, // end promptUser function
    scaffold: function(){
        // for easier reffing
        var UI = this.userInputs,
            testString = 'Building you a sweet app with the following deps:\n';
        //  Make a coolass string to tell the user what they agreed to install
        if( UI.jquery ){ testString += '\t- jQuery\n' }
        if( UI.angular ){ testString += '\t- Angular\n' }
        if( UI.gsap ){ testString += '\t- GSAP\n' }
        if( UI.bootstrap ){ testString += '\t- Bootstrap\n' }
        // if( UI.fontawesome ){ testString += '\t- FontAwesome Icons\n' }
        //  in case they're going bareback
        if( !UI.jquery && !UI.angular && !UI.gsap && !UI.bootstrap ){
            testString += '\t<no dependencies>\n'
            console.log(testString + chalk.red('Looks like someone\'s going bareback! YEEE HAWWW!\n') );
        }

    //  Make some directories
        //  app/ directories
        console.log(chalk.green("\n--  Creating app/ directories\n"));
        this.mkdir("app");
        this.mkdir("app/css");
        this.mkdir("app/js");
        this.mkdir("app/img");
        this.mkdir("app/lib");
        if( UI.angular ){
            this.mkdir("app/partials");
        }

        console.log(chalk.green("--  Creating build/ directories\n"));
        //  build/ dir, for builds
        this.mkdir("build");


    },
    copyFiles: function(){

        //  Some context for things that need templating
        var ctxt = {
                appName: this.appName,
                appDesc: this.desc,
                gender: this.gender,
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
            gender       = this.gender,
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
                    console.log(chalk.magenta("\n================================\n   Bower deps Installed, "+gender+"!   \n================================\n"));

                    //  CLEANUP SOME app/lib/ stuff
                    dCopy( 'app/lib_tmp/lesslie/dist/lesslie.less', 'app/lib/lesslie.less' );

                    if( userInputs.jquery ){
                        dCopy( 'app/lib_tmp/jquery/dist/jquery.js', 'app/lib/jquery.js' );
                    }
                    if( userInputs.angular ){
                        dCopy( 'app/lib_tmp/angular/angular.js', 'app/lib/angular.js' );
                    }
                    if( userInputs.gsap ){
                        dCopy( 'app/lib_tmp/gsap/src/uncompressed/TweenMax.js', 'app/lib/TweenMax.js' );
                        dCopy( 'app/lib_tmp/gsap/src/uncompressed/TimelineMax.js', 'app/lib/TimelineMax.js' );
                        dCopy( 'app/lib_tmp/gsap/src/uncompressed/plugins/CSSPlugin.js', 'app/lib/CSSPlugin.js' );
                        dCopy( 'app/lib_tmp/gsap/src/uncompressed/easing/EasePack.js', 'app/lib/EasePack.js' );
                    }
                    if( userInputs.bootstrap ){
                        dCopy( 'app/lib_tmp/bootstrap/dist/css/bootstrap.css', 'app/lib/bootstrap.css' );
                    }

                    del(['app/lib_tmp/'], function (err, deletedFiles) {
                        console.log('Files deleted:', deletedFiles.join(', '));
                    });

                    // done();
                }
            );

    },
    npm: function(){
        var gender = this.gender;
        this.npmInstall( '', function(){
            console.log(chalk.magenta("\n================================\n   NPM Modules Installed, "+gender+"!   \n================================\n"));
            // done();
        });
    },
    end: function(){
        var gender = this.gender;
        console.log(chalk.green("\n================================\n   Your eggs are ready, "+gender+"!   \n================================\n"));
    }

});

module.exports = EggsGennyGenerator;

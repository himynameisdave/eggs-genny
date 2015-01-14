'use strict';
///////////////////EGGS GENNY///////////////////

//  eggs-genny is a 5-phase process, as follows:

//    PHASE ONE:    Prompts
//    PHASE ONE-B:  GSAP Prompts
//    PHASE TWO:    Scaffold
//    PHASE THREE:  File Creation
//    PHASE FOUR:   Bower Install & Lib Cleanup
//    PHASE FIVE:   NPM Install

///////////////////////////////////////////////



//  require stuffs
var util   = require('util'),
    path   = require('path'),
    yeoman = require('yeoman-generator'),
    yosay  = require('yosay'),
    chalk  = require( "chalk" ),
    del    = require('del'),        //  Using del but should be using fs.unlink
    fs     = require('fs'),         //  To do some filesystem stuff easier
    banner = require('./banner.js'),//  Our own personal little banner for when they start eggs-genny

    //  A simple copy function utilizing streams
    copIt  = function( oldFile, newFile ){
      // console.log( chalk.yellow( "Copying "+oldFile+" over to "+newFile ) );
      fs.createReadStream( oldFile ).pipe( fs.createWriteStream( newFile ) );
    },

    //  Dead simple logging, any color!
    loggit = function(msg, color){
      if(typeof color === "undefined"){ var color = 'blue'; }
      var printThis = "=================================================\n"+msg+
                      "\n================================================="
      console.log( chalk[color]( printThis ) );
    }





/////////////Actual eggs-genny Module/////////////
var EggsGennyGenerator = yeoman.generators.Base.extend({

    ////////////////////////////////////////
    //    PHASE ONE: PERSONALIZE          //
    ////////////////////////////////////////
    personalize: function(){



      

    },


    //  PHASE ONE: Prompt questions at the user
    promptUser: function() {
        var done = this.async();

        // have our banner greet the user
        console.log( banner );

        //  The list of prompts
        var prompts = [
            {   //  What should we call the user?
                name:    "greeting",
                type:    "list",
                message: "First off, let's personalize things! Which do you prefer?",
                choices: [ "sir", "ma'am", "cap'n", "homie", "hombre" ],
                default: "sir"
            },{ //  What are they calling their app?
                name:    "name",
                message: "Now what did you say you were callin' this thing?",
                default: "egg"
            },{ //  What are they describing their app as?
                name:    "desc",
                message: "Care to describe this application of yours?",
                default: "Totally awesome rad app!"
            },//  DEPENDENCY PROPMTS
            {   //  Do they need jQuery?
                name:    "jquery",
                type:    "confirm",
                message: "Y'all need some jQuery?",
                default: true
            },{ //  Do they need Angular?
                name:    "angular",
                type:    "confirm",
                message: "Y'all need some Angular?",
                default: true
            },{ //  Do they need GSAP?
                name:    "gsap",
                type:    "confirm",
                message: "Y'all need some GSAP?",
                default: false
            },{ //  Do they need Bootstrap CSS?
                name:    "bootstrap",
                type:    "confirm",
                message: "Y'all need some Bootstrap CSS?",
                default: true
            }
        ];


        //  What actually prompts the users
        this.prompt(prompts, function (props) {

            //  Store all responses in a generic variable
            this.userInputs = props,
            //  App's name, description & greeting get it's own var for faster referencing
            this.appName = props.name;
            this.desc = props.desc;
            this.greeting = props.greeting;
            if( props.gsap ){
              this.gsap = {};
            }
            //  Call the async done function
            done();

        }.bind(this));

    },
    //  PHASE ONE-B
    gsapPrompts: function(){

      //  Only executes if they asked for GSAP
      if(this.userInputs.gsap){
        //  asyncer
        var done = this.async();

        loggit('GSAP Plugin Questions:', 'green');

        var prompts = [
          {   //  TweenLite or TweenMax?
              name:    "minMax",
              type:    "list",
              message: "Do you want TweenLite or TweenMax",
              choices: [ 'TweenLite', 'TweenMax' ],
              default: 'TweenLite'
          },
          {   //  What gsap plugs do ya want?
              name:    "plugs",
              type:    "checkbox",
              message: "Which GSAP plugins do you need?",
              choices: [
                {
                  name: "AttrPlugin",
                  checked: false
                },{
                  name: "CSSPlugin",
                  checked: true
                },{
                  name: "CSSRulePlugin",
                  checked: false
                },{
                  name: "EasePack",
                  checked: true
                },{
                  name: "RaphaelPlugin",
                  checked: false
                },{
                  name: "RoundPropsPlugin",
                  checked: false
                },{
                  name: "ScrollToPlugin",
                  checked: false
                }
              ]
          }
        ];

        this.prompt(prompts, function (props) {

          this.gsap.minMax = props.minMax;
          var plugs = [];

          props.plugs.forEach(function(plug){
            plugs.push( plug.toLowerCase() );
          });

          this.gsap.plugs = plugs;
          plugs = null;//reset plugs for le garbage man

          done();
        }.bind(this));

      }

    },
    //  PHASE TWO: Scaffold out the directory structure
    scaffold: function(){

        //  for easier/local referencing
        var UI         = this.userInputs,
            greeting   = this.greeting,
            testString = 'Building you a sweet app with the following deps:';

        //  Build a string that lets the user know what they've ordered
        if( UI.jquery ){ testString += '\n\t- jQuery' }
        if( UI.angular ){ testString += '\n\t- Angular' }
        if( UI.gsap ){ testString += '\n\t- GSAP' }
        if( UI.bootstrap ){ testString += '\n\t- Bootstrap' }

        //  If they aren't using anything, write a hilarious message...
        if( !UI.jquery && !UI.angular && !UI.gsap && !UI.bootstrap ){
            testString += '\n\t<no dependencies>'
            loggit( testString );
            loggit( 'Looks like someone\'s going bareback! YEEE HAWWW!', 'red' );
        }else{
        //  ...otherwise just log the built string
          loggit( testString );
        }

        //  Inform the user what we're doing
        loggit( "Building Your Directories, "+greeting, 'green' );
        //  Build out some directories
        this.mkdir("app");
        this.mkdir("app/css");
        this.mkdir("app/js");
        this.mkdir("app/img");
        this.mkdir("app/lib");
        this.mkdir("app/lib/css");
        this.mkdir("app/lib/js");
        this.mkdir("build");
        //  If they're using Angular they'll need a partials folder
        if( UI.angular ){
            this.mkdir("app/partials");
        }

    },
    //  PHASE THREE: Copy over template files
    copyFiles: function(){

        //  Some context for things that need templating
        var ctxt = {
                appName: this.appName,
                appDesc: this.desc,
                greeting: this.greeting,
                deps: this.userInputs
            };

        //  Copy over some bower-related stuff,
        //  adding the app name and description to the bower.json
        this.copy( '_.bowerrc', '.bowerrc' );
        this.template( '_bower.json', 'bower.json', ctxt );

        //  Copy over the main css files
        this.copy( 'app/css/_style.less', 'app/css/style.less' );
        this.copy( 'app/css/_style.css', 'app/css/style.css' );

        //  Angular has it's own particular package.json file & app.js file
        if( this.userInputs.angular ){
            this.template('_package.ang.json', "package.json", ctxt);
            this.copy( 'app/js/_app.ang.js', 'app/js/app.js' );
        }else{
            this.template('_package.json', "package.json", ctxt);
            this.copy( 'app/js/_app.js', 'app/js/app.js' );
        }

        //  Copy over gulpfile.js
        this.template( '_gulpfile.js', 'gulpfile.js', ctxt );
        //  Copy over index.html
        this.template('app/_index.html', "app/index.html", ctxt);

    },
    //  PHASE FOUR: Bower Install & Lib Cleanup
    bower: function(){

        //  depenencies for bower to install
        var dependencies = [ 'lesslie' ], // Lesslie is always a dep by default
          //  local variables for easier access
            greeting     = this.greeting,
            userInputs   = this.userInputs;

        //  Add needed deps to the list
        if( userInputs.jquery ){ dependencies.push('jquery'); }
        if( userInputs.angular ){ dependencies.push('angular'); }
        if( userInputs.gsap ){ dependencies.push('gsap'); }
        if( userInputs.bootstrap ){ dependencies.push('bootstrap'); }

        //  Actually do our bower install
        //  Note that the .bowerrc file installs everything to app/lib_tmp/
        this.bowerInstall(
            dependencies,
            { 'saveDev': true },
            //  Callback function that takes care of the /lib/ cleanup
            function(){
            //  Lib cleanup takes everything from the app/lib_tmp/ dir, moves it to app/lib/ dir, then deletes the app/lib_tmp dir

                //  Let the user know that everything has been installed
                loggit( "Bower dependencies installed, "+greeting+"!",'magenta' );

                //  Copy over Lesslie
                copIt( 'app/lib_tmp/lesslie/lesslie.less', 'app/lib/css/lesslie.less' );

                //  Copy jQuery if need be
                if( userInputs.jquery ){
                    copIt( 'app/lib_tmp/jquery/dist/jquery.js', 'app/lib/js/jquery.js' );
                }
                //  Copy Angular if need be
                if( userInputs.angular ){
                    copIt( 'app/lib_tmp/angular/angular.js', 'app/lib/js/angular.js' );
                }
                //  Copy GSAP if need be
                if( userInputs.gsap ){
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TweenMax.js', 'app/lib/js/TweenMax.js' );
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TimelineMax.js', 'app/lib/js/TimelineMax.js' );
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/plugins/CSSPlugin.js', 'app/lib/js/CSSPlugin.js' );
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/easing/EasePack.js', 'app/lib/js/EasePack.js' );
                }
                //  Copy Bootstrap if need be
                if( userInputs.bootstrap ){
                    copIt( 'app/lib_tmp/bootstrap/dist/css/bootstrap.css', 'app/lib/css/bootstrap.css' );
                }

                //  Deletes the app/lib_tmp with all the extra uneeded stuff
                del(['app/lib_tmp/'], function (err, deletedFiles) {});

                //  TODO: change the bower install location back to app/lib

            }
        );

    },
    //  PHASE FIVE: NPM Install & Finish
    npm: function(){

        //  So the greeting is localized
        var greeting = this.greeting;

        //  Run an NPM install
        //  Note there is nothing being passed as the 1st param, so that it will install everything in the package.json
        this.npmInstall( '', function(){

          //  Let the user know that everything has been installed
          loggit( "NPM modules installed, "+greeting+"!",'magenta' );

          //  Conclusion: Your eggs are ready, sir!
          console.log("\n\n\n");
          loggit( "Your eggs are ready, "+greeting+"!",'green' );
          console.log("\n");
        });

    }

});

module.exports = EggsGennyGenerator;

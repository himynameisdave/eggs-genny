'use strict';
///////////////////EGGS GENNY///////////////////

//  eggs-genny is a multi-phase process, as follows:

//    PHASE ONE:        Personalize
//    PHASE TWO:        Dependency Prompts
//    PHASE THREE-A:    GSAP MinMax (if applicable)
//    PHASE THREE-B:    GSAP Plugins (if applicable)
//    PHASE FOUR:       Scaffold
//    PHASE FIVE:       File Creation
//    PHASE SIX:        Bower Install & Lib Cleanup
//    PHASE SEVEN:      NPM Install

///////////////////////////////////////////////



//  require stuffs
var util   = require('util'),
    path   = require('path'),
    yeoman = require('yeoman-generator'),
    chalk  = require('chalk'),
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
    },

    //  Simple function that alters the install location after shit gets moved
    changeBowerInstallLocation = function(file){
      fs.readFile(file, 'utf8', function(err,data){
        if(err){
          loggit(err,'red');
          return;
        }
        var result = data.replace( /lib_tmp/g, 'lib' );

        fs.writeFile(file, result, 'utf8', function(err){
          if(err){
            loggit(err,'red');
            return;
          }
        });
      });
    },

/////////////Actual eggs-genny Module/////////////
EggsGennyGenerator = yeoman.generators.Base.extend({

    ////////////////////////////////////////
    //    PHASE ONE: PERSONALIZE          //
    ////////////////////////////////////////
    personalize: function(){
        var done = this.async();

        // have our banner greet the user
        console.log( banner );

        //  personal prompts
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
            }
        ];

        this.prompt(prompts, function (props) {

            //  App's name, description & greeting get it's own var for faster referencing
            this.greeting = props.greeting;
            this.appName = props.name.replace(/ /g, "-");
            this.desc = props.desc;

            //  Call the async done function
            done();

        }.bind(this));

    },
    ////////////////////////////////////////
    //    PHASE TWO: DEPENDENCIES         //
    ////////////////////////////////////////
    dependencies: function() {
        var done = this.async();

        loggit('Choose your dependencies:', 'green');

        //  The list of prompts
        var prompts = [
            {   //  What gsap plugs do ya want?
                name:    "plugs",
                type:    "checkbox",
                message: "Which dependencies do you need?",
                choices: [
                  {
                    name:    "jQuery",
                    checked: false
                  },{
                    name:    "Angular",
                    checked: false
                  },{
                    name:    "Bootstrap",
                    checked: false
                  },{
                    name:    "GSAP",
                    checked: false
                  }
                ]
            }
        ];

        //  What actually prompts the users
        this.prompt(prompts, function (props) {

        //  this will be the new var that stores the deps values
            var obj = {};
            props.plugs.forEach(function(dep){
              dep = dep.toLowerCase();
              obj[dep] = true;
            });
            this.deps = obj;

            //  create the gsap object if they said yes to GSAP
            if( props.gsap ){
              this.deps.gsap = {};
            }

            //  Call the async done function
            done();

        }.bind(this));

    },
    ////////////////////////////////////////
    //    PHASE THREE-A: GSAP MinMax      //
    ////////////////////////////////////////
    gsapMinMax: function(){
      //  Only executes if they asked for GSAP
      if(this.deps.gsap){
        var done = this.async();

        loggit('Do you need TweenLite or TweenMax?\n'+'TweenMax includes a bunch of plugins & TimelineLite by default', 'green');

        var prompts = [
          {
              name:    "minMax",
              type:    "list",
              message: "Do you want Tween/TimelineLite or Tween/TimelineMax?",
              choices: [ 'TweenLite', 'TweenMax' ],
              default: 'TweenLite'
          }
        ];

        this.prompt(prompts, function (props) {

          //  becasue currently it's only a boolean and he need it to store properties
          this.deps.gsap = {
            minMax: props.minMax
          };

          //  Call the async done guy
          done();
        }.bind(this));

      }
    },
    ////////////////////////////////////////
    //    PHASE THREE-B: GSAP PLUGINS     //
    ////////////////////////////////////////
    gsapPlugs: function(){

      //  Only executes if they asked for GSAP
      if(this.deps.gsap){
        //  asyncer
        var done = this.async();
        //  Wat wat gsap plugs
        loggit('Choose your GSAP Plugins:', 'green');

        if( this.deps.gsap.minMax === 'TweenLite' ){

          var prompts = [
            {   //  What gsap plugs do ya want?
                name:    "plugs",
                type:    "checkbox",
                message: "Which GSAP plugins do you need?",
                choices: [
                  {
                    name:    "AttrPlugin",
                    checked: false
                  },{
                    name:    "BezierPlugin",
                    checked: false
                  },{
                    name:    "CSSPlugin",
                    checked: true
                  },{
                    name:    "CSSRulePlugin",
                    checked: false
                  },{
                    name:    "DirectionalRotationPlugin",
                    checked: false
                  },{
                    name:    "EaselPlugin",
                    checked: false
                  },{
                    name:    "EasePack",
                    checked: true
                  },{
                    name:    "KineticPlugin",
                    checked: false
                  },{
                    name:    "RaphaelPlugin",
                    checked: false
                  },{
                    name:    "RoundPropsPlugin",
                    checked: false
                  },{
                    name:    "ScrollToPlugin",
                    checked: false
                  },{
                    name:    "TextPlugin",
                    checked: false
                  }
                ]
            }
          ];

        }else{

          var prompts = [
            {   //  What gsap plugs do ya want?
                name:    "plugs",
                type:    "checkbox",
                message: "Lots of GSAP Plugins are already included in TweenMax. Would you like these additional ones?",
                choices: [
                  {
                    name:    "CSSRulePlugin",
                    checked: false
                  },{
                    name:    "EaselPlugin",
                    checked: false
                  },{
                    name:    "RaphaelPlugin",
                    checked: false
                  },{
                    name:    "ScrollToPlugin",
                    checked: false
                  },{
                    name:    "TextPlugin",
                    checked: false
                  }
                ]
            }
          ];

        }

        this.prompt(prompts, function (props) {

          //  set a local plugs variable we can use in our loop function
          var plugs = [];

          //  Loop through plugin list and
          props.plugs.forEach(function(plug){
            plugs.push( plug );
          });

          //  store the plugins
          this.deps.gsap.plugs = plugs;
          done();plugs = null;

        }.bind(this));

      }//end check for gsap

    },
    ////////////////////////////////////////
    //    PHASE FOUR: SCAFFOLD            //
    ////////////////////////////////////////
    scaffold: function(){

        //  for easier/local referencing
        var deps       = this.deps,
            greeting   = this.greeting,
            testString = 'Building your app with the following deps, '+greeting+':';

        //  Build a string that lets the user know what they've ordered
        if( deps.jquery ){ testString += '\n\t- jQuery'; }
        if( deps.angular ){ testString += '\n\t- Angular'; }
        if( deps.bootstrap ){ testString += '\n\t- Bootstrap'; }
        if( deps.gsap ){
          testString += '\n\t- GSAP w/'+deps.gsap.minMax+' & the following plugins:';
          this.deps.gsap.plugs.forEach(function(p){
            testString += '\n\t |-- '+p;
          });
        }

        //  If they aren't using anything, write a hilarious message...
        if( !deps.jquery && !deps.angular && !deps.gsap && !deps.bootstrap ){
            testString += '\n\t<no dependencies>';
            loggit( testString, 'yellow' );
            loggit( 'Looks like someone\'s going bareback! Go get em, '+ greeting +'!', 'red' );
        }else{
        //  ...otherwise just log the built string
          loggit( testString, 'yellow' );
        }

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
        if( deps.angular ){
            this.mkdir("app/partials");
        }

    },
    ////////////////////////////////////////
    //    PHASE FIVE: BUILD FILES         //
    ////////////////////////////////////////
    buildFiles: function(){

        //  Some context for things that need templating
        var ctxt = {
                appName: this.appName,
                appDesc: this.desc,
                greeting: this.greeting,
                deps: this.deps
            };

        //  we want these items to get removed before trying to install anything
        del(['.bowerrc', 'bower.json'], function (err, deletedFiles) {});

        //  Copy over some bower-related stuff,
        //  adding the app name and description to the bower.json
        this.copy( '_.bowerrc', '.bowerrc' );
        this.template( '_bower.json', 'bower.json', ctxt );

        //  Copy over the main css files
        this.copy( 'app/css/_style.less', 'app/css/style.less' );
        this.copy( 'app/css/_style.css', 'app/css/style.css' );

        //  Copy over gulpfile.js
        this.template( '_gulpfile.js', 'gulpfile.js', ctxt );
        //  Copy over index.html
        this.template('app/_index.html', "app/index.html", ctxt);

        //  Angular has it's own particular package.json file & app.js file
        if( this.deps.angular ){
            this.template('_package.ang.json', "package.json", ctxt);
            this.copy( 'app/js/_app.ang.js', 'app/js/app.js' );
        }else{
            this.template('_package.json', "package.json", ctxt);
            this.copy( 'app/js/_app.js', 'app/js/app.js' );
        }

    },
    ////////////////////////////////////////
    //    PHASE SIX: BOWER INSTALLS       //
    ////////////////////////////////////////
    bower: function(){

        //  depenencies for bower to install
        var dependencies = [ 'lesslie' ], // Lesslie is always a dep by default
          //  local variables for easier access
            greeting     = this.greeting,
            deps   = this.deps;

        //  Add needed deps to the list
        if( deps.jquery ){ dependencies.push('jquery'); }
        if( deps.angular ){ dependencies.push('angular'); }
        if( deps.gsap ){ dependencies.push('gsap'); }
        if( deps.bootstrap ){ dependencies.push('bootstrap'); }

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
                if( deps.jquery ){
                  copIt( 'app/lib_tmp/jquery/dist/jquery.js', 'app/lib/js/jquery.js' );
                }
                //  Copy Angular if need be
                if( deps.angular ){
                  copIt( 'app/lib_tmp/angular/angular.js', 'app/lib/js/angular.js' );
                }
                //  Copy GSAP if need be
                if( deps.gsap ){

                  //  adding the minMax
                  if( deps.gsap.minMax === 'TweenLite' ){
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TweenLite.js', 'app/lib/js/TweenLite.js' );
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TimelineLite.js', 'app/lib/js/TimelineLite.js' );
                  }else {
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TweenMax.js', 'app/lib/js/TweenMax.js' );
                  }
                  //  loop through and add each plugin specified
                  deps.gsap.plugs.forEach(function(plug){
                    if( plug === 'EasePack' ){
                      copIt( 'app/lib_tmp/gsap/src/uncompressed/easing/'+plug+'.js', 'app/lib/js/'+plug+'.js' );
                    }else{
                      copIt( 'app/lib_tmp/gsap/src/uncompressed/plugins/'+plug+'.js', 'app/lib/js/'+plug+'.js' );
                    }
                  });

                }
                //  Copy Bootstrap if need be
                if( deps.bootstrap ){
                  copIt( 'app/lib_tmp/bootstrap/dist/css/bootstrap.css', 'app/lib/css/bootstrap.css' );
                }

                //  Deletes the app/lib_tmp with all the extra uneeded stuff
                del(['app/lib_tmp/'], function (err, deletedFiles) {});

                changeBowerInstallLocation('.bowerrc');

            }
        );

    },
    ////////////////////////////////////////
    //    PHASE SEVEN: NPM INSTALLS       //
    ////////////////////////////////////////
    npm: function(){

        //  So the greeting is localized
        var greeting = this.greeting;

        //  Run an NPM install
        //  Note there is nothing being passed as the 1st param, so that it will install everything in the package.json
        this.npmInstall( '', function(){

          //  Let the user know that everything has been installed
          loggit( "NPM modules installed, "+greeting+"!",'magenta' );

          //  Conclusion: Your eggs are ready, sir!
          console.log("\n");
          var ready = "   ___                     \n"+
                      "  /   \\    Your            \n"+
                      " |     |___  eggs          \n"+
                      " |     /   \\   are         \n"+
                      "  \\___|     |    ready,    \n"+
                      "      |     |        "+greeting+"\n"+
                      "       \\___/ ";


          loggit( ready,'green' );
          console.log("\n");
        });

    }

});

module.exports = EggsGennyGenerator;

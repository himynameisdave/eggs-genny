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
    loggit = require('loggit'),     //  For logging things to the console in a more visible way
    del    = require('del'),        //  Using del but should be using fs.unlink
    fs     = require('fs'),         //  To do some filesystem stuff easier
    banner = require('./banner.js'),//  Our own personal little banner for when they start eggs-genny

    //  A simple copy function utilizing streams
    copIt  = function( oldFile, newFile ){
      fs.createReadStream( oldFile ).pipe( fs.createWriteStream( newFile ) );
    },

    //  Simple function that alters the install location after shit gets moved
    changeBowerInstallLocation = function(file){
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
            },{ //  See if they use Sublime Text?
                name:    "sublime",
                type:    "confirm",
                message: "Do you use Sublime Text?",
                default: true
            }
        ];

        this.prompt(prompts, function (props) {

            //  App's name, description & greeting get it's own var for faster referencing
            this.greeting = props.greeting;
            this.appName  = props.name.replace(/ /g, "-");
            this.desc     = props.desc;
            this.sublime  = props.sublime;

            //  Call the async done function
            done();

        }.bind(this));

    },
    ////////////////////////////////////////
    //    PHASE TWO: DEPENDENCIES         //
    ////////////////////////////////////////
    dependenciesCSS: function() {
        var done = this.async();

        loggit('Choose your CSS dependencies:', 'green','+=');

        //  The list of prompts
        var prompts = [
            { //  What gsap plugs do ya want?
              name:    "plugs",
              type:    "checkbox",
              message: "Which CSS framework(s) would you like to use?",
              choices: [
                {
                  name:    "Bootstrap",
                  checked: false
                },{
                  name:    "Skeleton",
                  checked: false
                },{
                  name:    "Lesslie",
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
            this.depsCSS = obj;

            //  Call the async done function
            done();

        }.bind(this));

    },
    dependenciesJS: function() {
      var done = this.async();

      loggit('Choose your JS dependencies:', 'green','+=');

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
                  name:    "GSAP",
                  checked: false
                }
              ]
          },{
              //  Webapp touch icons?
              name:    "touchIcons",
              type:    "confirm",
              message: "Should I include some default mobile web app touch icons?",
              default: true
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
          this.depsJS = obj;
          this.icons = props.touchIcons;
          //  create the gsap object if they said yes to GSAP
          if( props.gsap ){
            this.depsJS.gsap = {};
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
      if(this.depsJS.gsap){
        var done = this.async();

        loggit('Do you need TweenLite or TweenMax?\n'+'TweenMax includes a bunch of plugins & TimelineLite by default', 'green','=+');

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
          this.depsJS.gsap = {
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
      if(this.depsJS.gsap){
        //  asyncer
        var done = this.async();
        //  Wat wat gsap plugs
        loggit('Choose your GSAP Plugins:', 'green', '=+');

        if( this.depsJS.gsap.minMax === 'TweenLite' ){

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
          this.depsJS.gsap.plugs = plugs;
          done();plugs = null;

        }.bind(this));

      }//end check for gsap

    },
    ////////////////////////////////////////
    //    PHASE FOUR: SCAFFOLD            //
    ////////////////////////////////////////
    scaffold: function(){

        //  for easier/local referencing
        var depsCSS    = this.depsCSS,
            depsJS     = this.depsJS,
            greeting   = this.greeting,
            testString = 'Yo '+greeting+'! I\'m building your app with the following deps :';

            testString += '\n\n===CSS Dependencies===';
        //  Build a string that lets the user know what they've ordered
        if( depsCSS.bootstrap ){ testString += '\n\t- Bootstrap'; }
        if( depsCSS.skeleton ){ testString += '\n\t- SkeletonCSS'; }
        if( depsCSS.lesslie ){ testString += '\n\t- Lesslie'; }

            testString += '\n\n===JS Dependencies===';
        if( depsJS.jquery ){ testString += '\n\t- jQuery'; }
        if( depsJS.angular ){ testString += '\n\t- Angular'; }
        if( depsJS.gsap ){
          testString += '\n\t- GSAP w/'+depsJS.gsap.minMax+' & the following plugins:';
          this.depsJS.gsap.plugs.forEach(function(p){
            testString += '\n\t |-- '+p;
          });
        }

        //  If they aren't using anything, write a hilarious message...
        if( !depsJS.jquery && !depsJS.angular && !depsJS.gsap && !depsCSS.skeleton && !depsCSS.bootstrap && !depsCSS.lesslie ){
            testString += '\n\t<no dependencies>';
            loggit( testString, 'yellow','~' );
            loggit( 'Looks like someone\'s going bareback! Go get em, '+ greeting +'!', 'red', '~' );
        }else{
        //  ...otherwise just log the built string
          loggit( testString, 'yellow', '~' );
        }

        //  Build out some directories
        this.mkdir("app");
        this.mkdir("app/css");
        this.mkdir("app/js");
        this.mkdir("app/img");
        if( this.icons ){
          this.mkdir("app/img/icons");
        }
        this.mkdir("app/lib");
        this.mkdir("app/lib/css");
        this.mkdir("app/lib/js");
        this.mkdir("build");
        //  If they're using Angular they'll need a partials folder
        if( depsJS.angular ){
            this.mkdir("app/partials");
        }

    },
    ////////////////////////////////////////
    //    PHASE FIVE: BUILD FILES         //
    ////////////////////////////////////////
    buildFiles: function(){

        //  Some context for things that need templating
        var ctxt = {
                appName:  this.appName,
                appDesc:  this.desc,
                greeting: this.greeting,
                icons:    this.icons,
                depsCSS:  this.depsCSS,
                depsJS:   this.depsJS
            };

        //  we want these items to get removed before trying to install anything
        del(['.bowerrc', 'bower.json'], function (err, deletedFiles) {});

        //  Copy over some bower-related stuff,
        //  adding the app name and description to the bower.json
        this.copy( '_.bowerrc', '.bowerrc' );
        this.template( '_bower.json', 'bower.json', ctxt );

        //  If they are using sublime, give them a workspace
        if(this.sublime){
          this.copy( '_project.sublime-project', this.appName+'.sublime-project' );
        }

        //  Copy over the main css files
        this.template( 'app/css/_style.less', 'app/css/style.less', ctxt );
        this.copy( 'app/css/_style.css', 'app/css/style.css' );

        //  Copy over gulpfile.js
        this.template( '_gulpfile.js', 'gulpfile.js', ctxt );
        //  Copy over index.html
        this.template('app/_index.html', "app/index.html", ctxt);

        //  Copy over favicon & apple icons
        this.copy( 'app/_favicon.ico', 'app/favicon.ico' );
        if(this.icons){
          this.copy( 'app/img/_apple-touch-icon-76x76.png', 'app/img/icons/apple-touch-icon-76x76.png' );
          this.copy( 'app/img/_apple-touch-icon-120x120.png', 'app/img/icons/apple-touch-icon-120x120.png' );
          this.copy( 'app/img/_apple-touch-icon-152x152.png', 'app/img/icons/apple-touch-icon-152x152.png' );
          this.copy( 'app/img/_apple-touch-icon-180x180.png', 'app/img/icons/apple-touch-icon-180x180.png' );
          this.copy( 'app/img/_touch-icon-192x192.png', 'app/img/icons/touch-icon-192x192.png' );
          this.copy( 'app/img/_metro-tile-icon.png', 'app/img/icons/metro-tile-icon.png' );
        }

        //  Angular has it's own particular package.json file & app.js file
        if( this.depsJS.angular ){
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
        var dependencies = [  ],
          //  local variables for easier access
            greeting     = this.greeting,
            depsCSS      = this.depsCSS,
            depsJS       = this.depsJS;

        //  Add needed deps to the list
        if( depsCSS.bootstrap ){ dependencies.push('bootstrap'); }
        if( depsCSS.skeleton ){ dependencies.push('skeleton'); }
        if( depsCSS.lesslie ){ dependencies.push('lesslie'); }
        if( depsJS.jquery ){ dependencies.push('jquery'); }
        if( depsJS.angular ){ dependencies.push('angular'); }
        if( depsJS.gsap ){ dependencies.push('gsap'); }

        //  Actually do our bower install
        //  Note that the .bowerrc file installs everything to app/lib_tmp/
        this.bowerInstall(
            dependencies,
            { 'saveDev': true },
            //  Callback function that takes care of the /lib/ cleanup
            function(){
            //  Lib cleanup takes everything from the app/lib_tmp/ dir, moves it to app/lib/ dir, then deletes the app/lib_tmp dir

                //  Copy jQuery if need be
                if( depsJS.jquery ){
                  copIt( 'app/lib_tmp/jquery/dist/jquery.js', 'app/lib/js/jquery.js' );
                }
                //  Copy Angular if need be
                if( depsJS.angular ){
                  copIt( 'app/lib_tmp/angular/angular.js', 'app/lib/js/angular.js' );
                }
                //  Copy GSAP if need be
                if( depsJS.gsap ){

                  //  adding the minMax
                  if( depsJS.gsap.minMax === 'TweenLite' ){
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TweenLite.js', 'app/lib/js/TweenLite.js' );
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TimelineLite.js', 'app/lib/js/TimelineLite.js' );
                  }else {
                    copIt( 'app/lib_tmp/gsap/src/uncompressed/TweenMax.js', 'app/lib/js/TweenMax.js' );
                  }
                  //  loop through and add each plugin specified
                  depsJS.gsap.plugs.forEach(function(plug){
                    if( plug === 'EasePack' ){
                      copIt( 'app/lib_tmp/gsap/src/uncompressed/easing/'+plug+'.js', 'app/lib/js/'+plug+'.js' );
                    }else{
                      copIt( 'app/lib_tmp/gsap/src/uncompressed/plugins/'+plug+'.js', 'app/lib/js/'+plug+'.js' );
                    }
                  });

                }
                //  Copy Bootstrap if need be
                if( depsCSS.bootstrap ){
                  copIt( 'app/lib_tmp/bootstrap/dist/css/bootstrap.css', 'app/lib/css/bootstrap.css' );
                }
                //  Copy Skeleton if need be
                if( depsCSS.skeleton ){
                  copIt( 'app/lib_tmp/skeleton/css/skeleton.css', 'app/lib/css/skeleton.css' );
                }
                //  Copy over Lesslie
                if( depsCSS.lesslie ){
                  copIt( 'app/lib_tmp/lesslie/dist/reset.less', 'app/lib/css/reset.less' );
                  copIt( 'app/lib_tmp/lesslie/dist/lesslie.less', 'app/lib/css/lesslie.less' );
                }

                //  Deletes the app/lib_tmp with all the extra uneeded stuff
                del(['app/lib_tmp/'], function (err, deletedFiles) {});

                changeBowerInstallLocation('.bowerrc');

                //  Let the user know that everything has been installed
                loggit( "Bower dependencies installed, "+greeting+"!",'magenta', '-=' );

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
          loggit( "NPM modules installed, "+greeting+"!",'magenta', '-=' );

          //  Conclusion: Your eggs are ready, sir!
          console.log("\n");
          var ready = "   ___                     \n"+
                      "  /   \\    Your            \n"+
                      " |     |___  eggs          \n"+
                      " |     /   \\   are         \n"+
                      "  \\___|     |    ready,    \n"+
                      "      |     |        "+greeting+"\n"+
                      "       \\___/ ";


          loggit( ready,'green', '#' );
          console.log("\n");
        });

    }

});

module.exports = EggsGennyGenerator;

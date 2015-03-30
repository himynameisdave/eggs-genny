'use strict';
///////////////////EGGS GENNY///////////////////
//                                            //
//  Welcome to eggs-genny, the poorly named   //
//       Yeoman generator for web apps.       //
//                                            //
////////////////////////////////////////////////


//  require stuffs
var yeoman   = require('yeoman-generator'),
    loggit   = require('loggit'),       //  For logging things to the console in a more visible way
    del      = require('del'),          //  Using del but should be using fs.unlink
    fs       = require('fs'),           //  To do some filesystem stuff easier
    banner   = require('./banner.js'),  //  Our own personal little banner for when they start eggs-genny
    finalMsg = require('./eggsAreReady.js'),  //  Our own personal final message
    utils    = require('./eggs-utils.js'),


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
                choices: [ "sir", "ma'am", "homie", "cap'n", "miss", "hombre", "boss" ],
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
            },{
              //  Webapp touch icons?
              name:    "icons",
              type:    "confirm",
              message: "Should I include some default mobile web app touch icons?",
              default: false
            }
        ];

        this.prompt(prompts, function (props) {

            //  App's name, description & greeting get it's own var for faster referencing
            var infoConfig = {
              greeting:         props.greeting,
              appName:          props.name,
              appNameSanitized: props.name.replace(/ /g, "-"),
              desc:             props.desc,
              sublime:          props.sublime,
              icons:            props.icons
            };

            this.config.set('info', infoConfig);
            this.config.save();

            //  Call the async done function
            done();

        }.bind(this));

    },
    preprocessor: function() {
      var done = this.async();

      loggit('Which CSS pre-processor would you like to use, '+this.config.get('info').greeting+'?', 'green','+=');

      //  The list of prompts
      var prompts = [
          {
            name:    "preprocessor",
            type:    "list",
            message: "Choose a CSS preprocessor:",
            choices: [ "Less", "Sass" ],
            default: "Less"
          }
      ];

      //  What actually prompts the users
      this.prompt(prompts, function (props) {

        //  store their preprocessor choice, lowercase'd
        this.config.set('preprocessor', props.preprocessor.toLowerCase());
        this.config.save();

        done();
      }.bind(this));

    },
    coffee: function() {
      var done = this.async();

      loggit('Would you like to use CoffeeScript, '+this.config.get('info').greeting+'?', 'green','+=');

      //  See if they would like to use CoffeeScript in their project
      var prompts = [
          {
            name:    "coffee",
            type:    "confirm",
            message: "CoffeeScript, want it or not?",
            default: false
          }
      ];

      //  What actually prompts the users
      this.prompt(prompts, function (props) {

        this.config.set('coffee', props.coffee);

        if( props.coffee ){ // if we're using CoffeeScript then we can assume they don't want ES6
          this.config.set('es6', false);
        }
        this.config.save();

        done();
      }.bind(this));
    },
    es6: function(){

      if( !this.config.get('coffee') ){//  only ask if they need ES6 if they already don't care about coffeescript
        var done = this.async();

        loggit('Would you like use ES6 in your scripts, '+this.config.get('info').greeting+'?', 'green', '+=');

        var prompts = [
          {
            name:    "es6",
            type:    "confirm",
            message: "ES6, you gunna use it or not?",
            default: false
          }
        ];

        this.prompt(prompts, function(props){

          this.config.set('es6', props.es6);
          this.config.save();

          done();
        }.bind(this));

      }
    },
    ////////////////////////////////////////
    //    PHASE TWO: DEPENDENCIES         //
    ////////////////////////////////////////
    dependenciesCSS: function() {
        var done = this.async();

        loggit('Choose your CSS dependencies, '+this.config.get('info').greeting+':' , 'green','+=');

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
                  name:    "Animate.css",
                  checked: false
                }
              ]
            }
        ];

        //  if they aren't using Less then don't ask them if they need Lesslie
        if(this.config.get('preprocessor') === 'less') {
          prompts[0].choices.push({
                                name:    "Lesslie",
                                checked: true
                              });
        }

        //  What actually prompts the users
        this.prompt(prompts, function (props) {

        //  this will be the new var that stores the deps values
            var obj = {};
            props.plugs.forEach(function(dep){
              dep = dep.toLowerCase();
              if(dep === 'animate.css'){
                obj.animate = true;
              }else{
                obj[dep] = true;
              }
            });

            this.config.set('depsCSS', obj);
            this.config.save();

            //  Call the async done function
            done();

        }.bind(this));

    },
    dependenciesJS: function() {
      var done = this.async();

      loggit('Choose your JS dependencies, '+this.config.get('info').greeting+':', 'green','+=');

      var prompts = [
          {   //  What js deps do ya want?
              name:    "plugs",
              type:    "checkbox",
              message: "Which dependencies do you need?",
              choices: [
                {
                  name:    "jQuery",
                  checked: false
                },{
                  name:    "Underscore",
                  checked: false
                },{
                  name:    "Angular",
                  checked: true
                },{
                  name:    "React",
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

          this.config.set('depsJS', obj);
          this.config.save();

          //  Call the async done function
          done();
      }.bind(this));

    },
    ////////////////////////////////////////
    //    PHASE THREE-A: GSAP MinMax      //
    ////////////////////////////////////////
    gsapMinMax: function(){
      //  Only executes if they asked for GSAP

      if( this.config.get('depsJS').gsap ){
        var done = this.async();

        loggit('Do you need TweenLite or TweenMax, '+this.config.get('info').greeting+'?\n'+'TweenMax includes a bunch of plugins & TimelineLite by default', 'green','=+');

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

          var depsJSObj      = this.config.get('depsJS');
              depsJSObj.gsap = { minMax: props.minMax };

          this.config.set('depsJS', depsJSObj);
          this.config.save();

          //  Call the async done guy
          done();
        }.bind(this));

      }
    },
    ////////////////////////////////////////
    //    PHASE THREE-B: GSAP PLUGINS     //
    ////////////////////////////////////////
    gsapPlugs: function(){

      var depsJSObj = this.config.get('depsJS'),
          prompts   = [];

      //  Only executes if they asked for GSAP
      if( depsJSObj.gsap ){
        //  asyncer
        var done = this.async();
        //  Wat wat gsap plugs
        loggit('Choose your GSAP Plugins, '+this.config.get('info').greeting+':', 'green', '=+');

        if( depsJSObj.gsap.minMax === 'TweenMax' ){

          prompts = [
            {   //  What gsap plugs do ya want?
                name:    "plugs",
                type:    "checkbox",
                message: "Lots of GSAP Plugins are already included in TweenMax. Would you like these additional ones, "+this.config.get('info').greeting+"?",
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
                    checked: true
                  },{
                    name:    "TextPlugin",
                    checked: false
                  }
                ]
            }
          ];

        }else{

          prompts = [
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
                    checked: true
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
          var depsJSObj            = this.config.get('depsJS');
              depsJSObj.gsap.plugs = plugs;

          this.config.set('depsJS', depsJSObj);
          this.config.save();

          done();plugs = null;

        }.bind(this));

      }//end check for gsap

    },
    ////////////////////////////////////////
    //    PHASE FOUR: SCAFFOLD            //
    ////////////////////////////////////////
    scaffold: function(){

        //  for easier/local referencing
        var info         = this.config.get('info'),
            greeting     = info.greeting,
            preprocessor = this.config.get('preprocessor'),
            coffee       = this.config.get('coffee'),
            depsCSS      = this.config.get('depsCSS'),
            depsJS       = this.config.get('depsJS'),
            testString   = 'Yo '+greeting+'! I\'m building your app with the following deps :';


        //  Build a string that lets the user know what they've ordered
        if( depsCSS.bootstrap || depsCSS.skeleton || depsCSS.animate || depsCSS.lesslie ){
            testString += '\n  ~ CSS Dependencies ~ ';
        }
        if( depsCSS.bootstrap ){ testString += '\n\t- Bootstrap CSS'; }
        if( depsCSS.skeleton ){ testString += '\n\t- Skeleton CSS'; }
        if( depsCSS.animate ){ testString += '\n\t- Animate.css'; }
        if( depsCSS.lesslie ){ testString += '\n\t- Lesslie'; }

        if( depsJS.jquery || depsJS.underscore || depsJS.angular || depsJS.react || depsJS.gsap ){
          testString += '\n  ~ JS Dependencies ~ ';
        }
        if( depsJS.jquery ){ testString += '\n\t- jQuery'; }
        if( depsJS.underscore ){ testString += '\n\t- Underscore'; }
        if( depsJS.angular ){ testString += '\n\t- Angular'; }
        if( depsJS.react ){ testString += '\n\t- ReactJS'; }
        if( depsJS.gsap ){
          testString += '\n\t- GSAP w/'+depsJS.gsap.minMax+' & the following plugins:';
          this.config.get('depsJS').gsap.plugs.forEach(function(p){
            testString += '\n\t |-- '+p;
          });
        }
        if(preprocessor === 'less'){
          testString += '\n...with Less';
        }else{
          testString += '\n...with Sass';
        }
        if(coffee){
          testString += ' and CoffeeScript.';
        }else{
          testString += ' as a preprocessor.';
        }

        //  If they aren't using anything, write a hilarious message...
        //  TODO: this is getting to large to maintain and should be removed
        if( !depsJS.jquery && !depsJS.underscore && !depsJS.angular && !depsJS.react && !depsJS.gsap && !depsCSS.skeleton && !depsCSS.animate && !depsCSS.bootstrap && !depsCSS.lesslie ){
          testString += '\n\t<no dependencies>';
          loggit( testString, 'yellow','~' );
          loggit( 'Looks like someone\'s going bareback! Go get em, '+ greeting +'!', 'red', '~' );
        }else{//  ...otherwise just log the built string
          loggit( testString, 'yellow', '~' );
        }


        //  Build out some directories
        this.mkdir("app");
        this.mkdir("app/css");
        this.mkdir("app/js");
        this.mkdir("app/img");
        if( this.config.get('info').icons ){
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
        //  TODO:  you could use a this.config.getAll() call here to clean this a bit... will require changing the templated files
        //         or you could just pass this.config onto the actual templates
        var info = this.config.get('info');
        var ctxt = {
                appName:      info.appName,
                appNameSanitized: info.appNameSanitized,
                appDesc:      info.desc,
                icons:        info.icons,
                greeting:     info.greeting,
                preprocessor: this.config.get('preprocessor'),
                coffee:       this.config.get('coffee'),
                es6:          this.config.get('es6'),
                depsCSS:      this.config.get('depsCSS'),
                depsJS:       this.config.get('depsJS')
            };

        //  we want these items to get removed before trying to install anything
        del(['.bowerrc', 'bower.json'], function (err, deletedFiles) {});

        //  Copy over some bower-related stuff,
        //  adding the app name and description to the bower.json
        this.copy( '_.bowerrc', '.bowerrc' );
        this.template( '_bower.json', 'bower.json', ctxt );

        //  Copy over favicon & apple icons
        this.copy( 'app/_favicon.ico', 'app/favicon.ico' );
        //  es6 over our timestamp
        this.copy( '_timestamp.js', 'node_modules/timestamp/timestamp.js' );
        //  Copy over the touch icons
        if(ctxt.icons){
          this.copy( 'app/img/_apple-touch-icon-76x76.png', 'app/img/icons/apple-touch-icon-76x76.png' );
          this.copy( 'app/img/_apple-touch-icon-120x120.png', 'app/img/icons/apple-touch-icon-120x120.png' );
          this.copy( 'app/img/_apple-touch-icon-152x152.png', 'app/img/icons/apple-touch-icon-152x152.png' );
          this.copy( 'app/img/_apple-touch-icon-180x180.png', 'app/img/icons/apple-touch-icon-180x180.png' );
          this.copy( 'app/img/_touch-icon-192x192.png', 'app/img/icons/touch-icon-192x192.png' );
          this.copy( 'app/img/_metro-tile-icon.png', 'app/img/icons/metro-tile-icon.png' );
        }
        //  Copy over gulpfile.js
        this.template( '_gulpfile.js', 'gulpfile.js', ctxt );
        //  Copy over index.html
        this.template('app/_index.html', "app/index.html", ctxt);
        //  Copy over readme
        this.template('_README.md', "README.md", ctxt);

        //  write 'em a .gitignore
        var gi = "node_modules/\n*.DS_Store\n"+ctxt.appNameSanitized+".sublime-project\n";
        this.write( '.gitignore', gi);

        //  If they are using sublime, give them a workspace
        if(this.config.get('info').sublime){
          var sublime = "{\n\t\"folders\":\n\t[\n\t\t{\n\t\t\t\"follow_symlinks\": true,\n\t\t\t\"path\": \"./\"\n\t\t}\n\t]\n}";
          this.write( ctxt.appNameSanitized+'.sublime-project', sublime );
        }

        //  Copy over the main css files
        if(ctxt.preprocessor === 'less'){
          this.template( 'app/css/_style.less', 'app/css/style.less', ctxt );
          if( !ctxt.depsCSS.lesslie ){
            this.template( 'app/css/_reset.less', 'app/css/reset.less', ctxt );
          }
        }else{
          this.copy( 'app/css/_style.sass', 'app/css/style.sass' );
          this.copy( 'app/css/_reset.sass', 'app/css/reset.sass' );
        }
        this.copy( 'app/css/_style.css', 'app/css/style.css' );

        //  copy over app.js
        if( ctxt.depsJS.angular ){
          if( ctxt.coffee ){
            this.template( 'app/js/_app.ang.coffee', 'app/js/app.coffee', ctxt );
            this.write('app/js/app.js', "(function() {var app;app = angular.module('app', []);app.controller('Controller', function($scope) {});}).call(this);");
          }else{
            this.template( 'app/js/_app.ang.js', 'app/js/app.js', ctxt );
          }
        }else{
          if( ctxt.coffee ){
            this.template( 'app/js/_app.coffee', 'app/js/app.coffee', ctxt );
            this.write('app/js/app.js', "(function(){document.addEventListener('DOMContentLoaded', function() {});}).call(this);");
          }else{
            this.template( 'app/js/_app.js', 'app/js/app.js', ctxt );
          }
        }

        //  Build the package.json
        var pkg = {
              "name": ctxt.appNameSanitized,
              "version": "0.0.1",
              "description": ctxt.appDesc,
              "main": "gulpfile.js",
              "private": "true",
              "devDependencies": {
                "del": "^1.1.0",
                "loggit": "^0.2.0",
                "glob": "^4.3.5",
                "gulp": "^3.8.10",
                "gulp-autoprefixer": "^2.0.0",
                "gulp-concat": "^2.4.2",
                "gulp-connect": "^2.2.0",
                "gulp-csscomb": "^3.0.3",
                "gulp-csslint": "^0.1.5",
                "gulp-html-replace": "^1.4.1",
                "gulp-imagemin": "^2.1.0",
                "gulp-jshint": "^1.9.0",
                "gulp-livereload": "^3.0.2",
                "gulp-load-plugins": "^0.8.0",
                "gulp-crass": "^0.1.2",
                "gulp-uglify": "^1.0.2",
                "gulp-uncss": "^0.5.2"
              }
            };

        if( this.config.get('depsJS').angular ){
          pkg.devDependencies["gulp-ng-annotate"] = "^0.3.4";
          pkg.devDependencies["gulp-angular-htmlify"] = "^1.1.0";
        }
        if( this.config.get('coffee') ){
          pkg.devDependencies["gulp-coffee"] = "^2.3.1";
        }else if(this.config.get('es6')){
          pkg.devDependencies["gulp-babel"] = "^4.0.0";
        }
        if( this.config.get('preprocessor') === 'less' ){
          pkg.devDependencies["gulp-less"] = "^2.0.1";
        }else{
          pkg.devDependencies["gulp-sass"] = "^1.3.3";
        }

        this.write('package.json',JSON.stringify(pkg, null, 2));

    },
    ////////////////////////////////////////
    //    PHASE SIX: BOWER INSTALLS       //
    ////////////////////////////////////////
    bower: function(){

      if( !this.options['skip-install'] ){

        //  depenencies for bower to install
        var dependencies = [  ],
          //  local variables for easier accesss
            greeting     = this.config.get('info').greeting,
            depsCSS      = this.config.get('depsCSS'),
            depsJS       = this.config.get('depsJS');

        //  Add needed deps to the list
        if( depsCSS.bootstrap ){ dependencies.push('bootstrap'); }
        if( depsCSS.skeleton ){ dependencies.push('skeleton'); }
        if( depsCSS.animate ){ dependencies.push('animate.css'); }
        if( depsCSS.lesslie ){ dependencies.push('lesslie'); }
        if( depsJS.jquery ){ dependencies.push('jquery'); }
        if( depsJS.underscore ){ dependencies.push('underscore'); }
        if( depsJS.angular ){ dependencies.push('angular'); }
        if( depsJS.react ){ dependencies.push('react'); }
        if( depsJS.gsap ){ dependencies.push('gsap'); }

        //  Actually do our bower install
        //  Note that the .bowerrc file installs everything to app/lib_tmp/
        this.bowerInstall(
            dependencies,
            { 'saveDev': true },
            //  Callback function that takes care of the /lib/ cleanup
            function(){
            //  Lib cleanup takes everything from the app/lib_tmp/ dir, moves it to app/lib/ dir, then deletes the app/lib_tmp dir

                //  Copy Bootstrap if need be
                if( depsCSS.bootstrap ){
                  utils.copyThis( 'app/lib_tmp/bootstrap/dist/css/bootstrap.css', 'app/lib/css/bootstrap.css' );
                  utils.copyThis( 'app/lib_tmp/bootstrap/dist/css/bootstrap.css.map', 'app/lib/css/bootstrap.css.map' );
                }
                //  Copy Skeleton if need be
                if( depsCSS.skeleton ){
                  utils.copyThis( 'app/lib_tmp/skeleton/css/skeleton.css', 'app/lib/css/skeleton.css' );
                }
                //  Copy Animate.css if need be
                if( depsCSS.animate ){
                  utils.copyThis( 'app/lib_tmp/animate.css/animate.css', 'app/lib/css/animate.css' );
                }
                //  Copy over Lesslie
                if( depsCSS.lesslie ){
                  utils.copyThis( 'app/lib_tmp/lesslie/dist/reset.less', 'app/lib/css/reset.less' );
                  utils.copyThis( 'app/lib_tmp/lesslie/dist/lesslie.less', 'app/lib/css/lesslie.less' );
                }
                if( depsJS.react ){
                  utils.copyThis( 'app/lib_tmp/react/react.js', 'app/lib/js/react.js' );
                  utils.copyThis( 'app/lib_tmp/react/JSXTransformer.js', 'app/lib/js/JSXTransformer.js' );
                }
                //  Copy jQuery if need be
                if( depsJS.jquery ){
                  utils.copyThis( 'app/lib_tmp/jquery/dist/jquery.js', 'app/lib/js/jquery.js' );
                }
                //  Copy Underscore if need be
                if( depsJS.underscore ){
                  utils.copyThis( 'app/lib_tmp/underscore/underscore.js', 'app/lib/js/underscore.js' );
                }
                //  Copy Angular if need be
                if( depsJS.angular ){
                  utils.copyThis( 'app/lib_tmp/angular/angular.js', 'app/lib/js/angular.js' );
                }
                //  Copy GSAP if need be
                if( depsJS.gsap ){

                  //  adding the minMax
                  if( depsJS.gsap.minMax === 'TweenLite' ){
                    utils.copyThis( 'app/lib_tmp/gsap/src/uncompressed/TweenLite.js', 'app/lib/js/TweenLite.js' );
                    utils.copyThis( 'app/lib_tmp/gsap/src/uncompressed/TimelineLite.js', 'app/lib/js/TimelineLite.js' );
                  }else {
                    utils.copyThis( 'app/lib_tmp/gsap/src/uncompressed/TweenMax.js', 'app/lib/js/TweenMax.js' );
                  }
                  //  loop through and add each plugin specified
                  depsJS.gsap.plugs.forEach(function(plug){
                    if( plug === 'EasePack' ){
                      utils.copyThis( 'app/lib_tmp/gsap/src/uncompressed/easing/'+plug+'.js', 'app/lib/js/'+plug+'.js' );
                    }else{
                      utils.copyThis( 'app/lib_tmp/gsap/src/uncompressed/plugins/'+plug+'.js', 'app/lib/js/'+plug+'.js' );
                    }
                  });

                }

                //  Deletes the app/lib_tmp with all the extra uneeded stuff
                del(['app/lib_tmp/'], function (err, deletedFiles) {});

                utils.changeBowerInstallLocation('.bowerrc');

                //  Let the user know that everything has been installed
                loggit( "Bower dependencies installed, "+greeting+"!",'magenta', '-=' );

            }
        );

      }//end check if skip install

    },
    ////////////////////////////////////////
    //    PHASE SEVEN: NPM INSTALLS       //
    ////////////////////////////////////////
    npm: function(){

      //  So the greeting is localized
      var greeting   = this.config.get('info').greeting;

      if( !this.options['skip-install'] ){

        //  Run an NPM install
        //  Note there is nothing being passed as the 1st param, so that it will install everything in the package.json
        this.npmInstall( '', function(){

          //  Let the user know that everything has been installed
          loggit( "NPM modules installed, "+greeting+"!",'magenta', '-=' );
          //  Conclusion: Your eggs are ready, sir!
          loggit( finalMsg(greeting) );

        });

      }else{
        var installMsg = "Run `bower install & npm install`\nto install dependencies when you're ready!";

        //  Conclusion: Your eggs are ready, sir!
        loggit( finalMsg(greeting) );

        if( installMsg.length > 1 ){
          loggit( installMsg, 'yellow', '&%' );
        };
      }

    }

});

module.exports = EggsGennyGenerator;

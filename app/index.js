'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require( "chalk" );
var banner = require('./banner.js');

var EggsGennyGenerator = yeoman.generators.Base.extend({
    promptUser: function() {
        var done = this.async();

        // have our banner greet the user
        console.log( banner );

        //  PROMPT USER TO FIGURE OUT WHAT DEPENDENCIES TO JAM IN THERE
        var prompts = [
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
            console.log(testString + chalk.red('Looks like someone\'s going bareback!\n') );
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
            this.template( '_gulpfile.ang.js', 'gulpfile.js', ctxt );
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
        var dependencies = [ 'lesslie' ]

        // var done = this.async();

        //  Announce what we're doing
        //  Kinda irrelevant cause async

        // console.log(chalk.cyan(
        //                 "\n=======================\n" +
        //                   "==     BOWER TIME    ==\n" +
        //                   "=======================\n"
        //             ));

        //  Add needed deps to the list
        if( this.userInputs.jquery ){ dependencies.push('jquery'); }
        if( this.userInputs.angular ){ dependencies.push('angular'); }
        if( this.userInputs.gsap ){ dependencies.push('gsap'); }
        if( this.userInputs.bootstrap ){ dependencies.push('bootstrap'); }

        //  Actually do our bower install
        this.bowerInstall(
                dependencies,
                { 'saveDev': true },
                function(){
                    console.log("\nBowers Setup! !!!\n");
                    // done();
                }
            );

    },
    npm: function(){
        // var done = this.async();

        // console.log(chalk.red(
        //                 "\n=======================\n" +
        //                   "==      NPM TIME     ==\n" +
        //                   "=======================\n"
        //             ));

        this.npmInstall( '', function(){
            console.log("\nNPM's installed! !!!\n");
            // done();
        });
    },
    end: function(){

        console.log(chalk.blue("\n================================\n   Your eggs are ready, sir!   \n================================\n"));
    }

});

module.exports = EggsGennyGenerator;

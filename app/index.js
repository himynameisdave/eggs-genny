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
        }];

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

        //  check for jQuery:
        if( UI.jquery ){
            //do jquery stuff
            testString += '\t- jQuery\n'
        }

        if( UI.angular ){
            //do angular stuff
            testString += '\t- Angular\n'
        }

        if( UI.gsap ){
            //do gsap stuff
            testString += '\t- GSAP\n'
        }

        if( UI.bootstrap ){
            //do bootstrap stuff
            testString += '\t- Bootstrap\n'
        }

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
        //  temp/ directory, where files can be stored temporarily
        this.mkdir("app/tmp");
        this.mkdir("app/lib");

        console.log(chalk.green("--  Creating build/ directories\n"));
        //  build/ dir, for builds
        this.mkdir("build");


    },
    copyFiles: function(){

        var ctxt = {
                appName: this.appName,
                appDesc: this.desc,
                deps: this.userInputs
            };

        //  package.json && gulpfile.js
        if( this.userInputs.angular ){
            this.template('_package.ang.json', "package.json", ctxt);
            this.copy( '_gulpfile.ang.js', 'gulpfile.js' );
        }else{
            this.template('_package.json', "package.json", ctxt);
            this.copy( '_gulpfile.js', 'gulpfile.js' );
        }

        //  main html file
        this.template('app/_index.html', "app/index.html", ctxt);




    },
    end: function(){
        console.log(chalk.blue("\n================================\n   Your eggs are ready, sir!   \n================================\n"));
    }

});

module.exports = EggsGennyGenerator;

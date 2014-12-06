'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
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
            this.appName = props.appName;

            done();
        }.bind(this));
    }, // end promptUser function
    scaffold: function(){




    }
});

module.exports = EggsGennyGenerator;

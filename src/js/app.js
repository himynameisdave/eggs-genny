//	DEFINE APP
var app = angular.module('app', ['ui.router']);


app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "partials/intro.html",
        controller: "Controller"
      })
      .state('what-is-yeoman', {
        url: "/what-is-yeoman",
        templateUrl: "partials/.html",
        controller: "Controller"
      })

}]);


//	MAIN CONTROLLER
app.controller('Controller', ["$scope", function ($scope) {


  $scope.navlist = [
    {
      name: "Intro",
      link: "",
      subs: [
        {
          name: "What the f-word is Yeoman?",
          link: "what-is-yeoman"
        },
        {
          name: "Installation/Setup",
          link: "installation"
        }
      ]
    },{
      name: "Dependencies",
      link: "dependencies",
      subs: [
        {
          name: "jQuery",
          link: "jquery"
        },
        {
          name: "AngularJS",
          link: "angular"
        },
        {
          name: "Bootstrap CSS",
          link: "bootstrap"
        },
        {
          name: "GSAP",
          link: "GSAP"
        }
      ]
    },{
      name: "Usage",
      link: "usage",
      subs: [
        {
          name: "Basic Directory Structure",
          link: "directory-structure"
        },{
          name: "Gulp - Development",
          link: "gulp-dev"
        },{
          name: "Gulp - Build",
          link: "gulp-build"
        }
      ]
    },{
      name: "About",
      link: "about",
      subs: [
        {
          name: "Planned Features",
          link: "planned-features"
        },{
          name: "Help a brother out?",
          link: "help-a-brother-out"
        }
      ]
    }
  ];


}]);

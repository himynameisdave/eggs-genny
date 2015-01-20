//	DEFINE APP
var app = angular.module('app', ['ui.router']);


app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
      .state("intro", {
        url: "/",
        templateUrl: "partials/intro.html"
      })
      .state("what-is-yeoman", {
        url: "/what-is-yeoman",
        templateUrl: "partials/what-is-yeoman.html"
      })
      .state("installation", {
        url: "/installation",
        templateUrl: "partials/installation.html"
      })

      .state("dependencies", {
        url: "/dependencies",
        templateUrl: "partials/dependencies.html"
      })
      .state("jquery", {
        url: "/jquery",
        templateUrl: "partials/jquery.html"
      })
      .state("angular", {
        url: "/angular",
        templateUrl: "partials/angular.html"
      })
      .state("bootstrap", {
        url: "/bootstrap",
        templateUrl: "partials/bootstrap.html"
      })
      .state("gsap", {
        url: "/GSAP",
        templateUrl: "partials/gsap.html"
      })

      .state("usage", {
        url: "/usage",
        templateUrl: "partials/usage.html"
      })
      .state("directory-structure", {
        url: "/directory-structure",
        templateUrl: "partials/directory-structure.html"
      })
      .state("gulp-dev", {
        url: "/gulp-dev",
        templateUrl: "partials/gulp-dev.html"
      })
      .state("gulp-build", {
        url: "/gulp-build",
        templateUrl: "partials/gulp-build.html"
      })

      .state("about", {
        url: "/about",
        templateUrl: "partials/about.html"
      })
      .state("planned-features", {
        url: "/planned-features",
        templateUrl: "partials/planned-features.html"
      })
      .state("help-a-brother-out", {
        url: "/help-a-brother-out",
        templateUrl: "partials/help-a-brother-out.html"
      });

}]);


//	MAIN CONTROLLER
app.controller('Controller', ["$scope", "$state", function ($scope, $state) {

  $scope.navlist = [
    {
      name: "Intro",
      link: "intro",
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
          link: "gsap"
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



  $scope.getOuttaHere = function(partial){
    $state.go(partial);
  };


  $scope.menuState = false;
  $scope.toggleMenu = function(){

    if($scope.menuState){
      $scope.menuState = false;
    }else{
      $scope.menuState = true;
    }

  };


}]);



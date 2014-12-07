
//	DEFINE APP
var app = angular.module('app', ['ui.router']);

//	CONFIG UI ROUTER
app.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider
	    .state('home', {
	      url: "/",
	      templateUrl: "partials/",
	      controller: "Controller"
	    })
});


//	MAIN CONTROLLER
app.controller('Controller', function ($scope) {


	//	Make unicorns fly...


});

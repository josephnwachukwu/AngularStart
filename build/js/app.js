//Angular Boilerplate App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'boilerplate' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'boilerplate.controllers' is found in controllers.js
// 'boilerplate.services' is found in services.js
// 'boilerplate.directives' is found in directives.js
angular.module('boilerplate', ['boilerplate.controllers', 'boilerplate.services', 'boilerplate.directives'])


.run(function(){

})

.config(function($stateProvider, $urlRouterProvider){
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/state1");
	//
	// Now set up the states
	$stateProvider
	.state('home', {
		url: "/home",
		templateUrl: "partials/home.html"
	})
	.state('state2', {
		url: "/state2",
		templateUrl: "partials/state2.html"
	})
	.state('state2.list', {
		url: "/list",
			templateUrl: "partials/state2.list.html",
			controller: function($scope) {
			$scope.things = ["A", "Set", "Of", "Things"];
		}
	});
});
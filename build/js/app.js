//Angular Boilerplate App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'boilerplate' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'boilerplate.controllers' is found in controllers.js
// 'boilerplate.services' is found in services.js
// 'boilerplate.directives' is found in directives.js
angular.module('boilerplate', [ 'ui.router', 'boilerplate.controllers', 'boilerplate.services', 'boilerplate.directives'])


.run(function(){

})

.config(function($stateProvider, $urlRouterProvider){
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/");
	//
	// Now set up the states
	$stateProvider
	.state('home', {
        url: "/home",
        views: {
            'header': {
                templateUrl: 'views/header.html',
                controller: 'headerCtrl'
            },
            'main': {
                template: '<div ui-view></div>',
                controller: 'homeCtrl'
            },
            'footer': {
                templateUrl: 'views/footer.html',
                controller: 'footerCtrl'
            }
        }
    });
});
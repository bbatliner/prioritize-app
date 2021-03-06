'use strict';

var checkLoggedin = function($q, $http, $location, $rootScope) {
	// Initialize a new promise
	var deferred = $q.defer();
	// Make an AJAX call to check if the user is logged in 
	$http.get('/api/loggedin').success(function(user) { 
		// Authenticated 
		if (user !== '0') {
			$rootScope.user = user;
			deferred.resolve();
		}
		// Not Authenticated 
		else { 
			$rootScope.user = false;
			deferred.reject();
			$location.url('/login');
		}
	});

	return deferred.promise;
};

/**
 * @ngdoc overview
 * @name myTodoAngularAppApp
 * @description
 * # myTodoAngularAppApp
 *
 * Main module of the application.
 */
angular.module('myTodoAngularApp', [
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ui.date'
])
	.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainController'
		})
		.when('/todo-list', {
			templateUrl: 'views/todo.html',
			controller: 'TodoController',
			resolve: {
				loggedin: checkLoggedin
			}
		})
		.when('/about', {
			templateUrl: 'views/about.html',
			controller: 'AboutController',
		})
		.when('/help', {
			templateUrl: 'views/help.html',
			controller: 'HelpController'
		})
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupController'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})
		.when('/me', {
			templateUrl: 'views/me.html',
			controller: 'MeController',
			resolve: {
				loggedin: checkLoggedin
			}
		})
		.otherwise({
			redirectTo: '/'
		});

		// Why is this commented? For deep-linking, refreshing the page
		// at a URL other than '/' will 404. How come? When the browser
		// tries to GET 'http://website.com/example', it looks for a file
		// at '/example', which doesn't exist, and then 404s. There are
		// ways to get around this (see http://jjt.io/2013/11/16/angular-
		// html5mode-using-yeoman-generator-angular/), but for now, it's
		// too much work. So I've commented it ;)
		//
		// Use the HTML5 History API
		// $locationProvider.html5Mode(true);
	})
	.run(function($rootScope, $location, $window) {
	// Send Google Analytics pageview event when route changes
	$rootScope.$on('$routeChangeSuccess', function() {
		$window.ga('send', 'pageview', { page: $location.path() });
	});
});

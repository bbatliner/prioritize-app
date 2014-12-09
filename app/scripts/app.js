'use strict';

/**
 * @ngdoc overview
 * @name myTodoAngularAppApp
 * @description
 * # myTodoAngularAppApp
 *
 * Main module of the application.
 */
angular
  .module('myTodoAngularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/todo.html',
        controller: 'TodoCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      // Use the HTML5 History API
      $locationProvider.html5Mode(true);
  });

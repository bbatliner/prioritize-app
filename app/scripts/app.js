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
        controller: 'TodoController'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .otherwise({
        redirectTo: '/'
      });

      // Use the HTML5 History API
      $locationProvider.html5Mode(true);
  });

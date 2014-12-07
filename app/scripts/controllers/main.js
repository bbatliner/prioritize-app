'use strict';

/**
 * @ngdoc function
 * @name myTodoAngularAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myTodoAngularAppApp
 */
angular.module('myTodoAngularApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

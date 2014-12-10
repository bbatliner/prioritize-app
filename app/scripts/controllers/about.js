'use strict';

/**
 * @ngdoc function
 * @name myTodoAngularAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the myTodoAngularAppApp
 */
angular.module('myTodoAngularApp')
  .controller('AboutController', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

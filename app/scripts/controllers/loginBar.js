angular.module('myTodoAngularApp')
	.controller('LoginBarController', ['$scope', '$rootScope', function ($scope, $rootScope) {
		$scope.user = $rootScope.user;
		$scope.hello = 'Hello!';
	}]);

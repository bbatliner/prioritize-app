angular.module('myTodoAngularApp')
	.controller('LoginBarController', ['$scope', '$rootScope', function ($scope, $rootScope) {
		
		$scope.hello = 'Hello!';
		$scope.user = 'empty!';

		$scope.$watch(function() {
			return $rootScope.user;
		}, function() {
			$scope.user = $rootScope.user;
		});
	}]);

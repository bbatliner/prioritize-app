angular.module('myTodoAngularApp')
	.controller('MeController', ['$scope', '$rootScope', function ($scope, $rootScope) {
		$scope.user = $rootScope.user;
		$scope.userStartDate = Date.parse($scope.user.createdAt).toString('MMMM d, yyyy');
	}]);

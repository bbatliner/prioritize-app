'use strict';

angular.module('myTodoAngularApp')
	.controller('SignupController', ['$scope', '$timeout', '$location', '$http', function ($scope, $timeout, $location, $http) {

		$scope.firstName = '';
		$scope.lastName = '';
		$scope.email = '';
		$scope.password = '';
		
		$scope.signup = function() {
			var data = {
				firstName: $scope.firstName,
				lastName: $scope.lastName,
				email: $scope.email,
				password: $scope.password
			};
			$http.post('/api/signup', data)
				.success(function(data) {
					noty({ type: 'success', text: 'Successfully signed up!', timeout: 1200 });
					$timeout(function() {
						$location.path('/todo-list');
					}, 750);
				})
				.error(function(data) {
					noty({ type: 'error', text: data.responseText , timeout: 1200 });
				});
		};
	}]);

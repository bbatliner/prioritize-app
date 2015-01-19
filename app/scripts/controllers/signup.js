'use strict';

angular.module('myTodoAngularApp')
	.controller('SignupController', ['$scope', function ($scope) {

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
			$.post('/api/signup', data)
				.done(function(data) {
					noty({ type: 'success', text: 'Successfully signed up!', timeout: 1200 });
				})
				.error(function(data) {
					noty({ type: 'error', text: data.error });
				});
		};
	}]);

'use strict';

angular.module('myTodoAngularApp')
	.controller('LoginController', ['$scope', function ($scope) {

		$scope.email = '';
		$scope.password = '';
		
		$scope.login = function() {
			var data = {
				email: $scope.email,
				password: $scope.password
			};
			$.post('/api/login', data)
				.done(function(data) {
					console.log(data);
					noty({ type: 'success', text: 'Successfully logged in!', timeout: 1200 });
				})
				.error(function(data) {
					console.log(data);
					noty({ type: 'error', text: data.responseJSON.error, timeout: 1200 });
				});
		};
	}]);

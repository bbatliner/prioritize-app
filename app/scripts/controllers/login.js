'use strict';

angular.module('myTodoAngularApp')
	.controller('LoginController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {

		$scope.email = '';
		$scope.password = '';
		
		$scope.login = function() {
			var data = {
				email: $scope.email,
				password: $scope.password
			};
			$.post('/api/login', data)
				.done(function(data) {
					noty({ 
						type: 'success',
						text: 'Successfully logged in!',
						timeout: 1000,
					});
					$timeout(function() {
						$location.path('/todo-list');
					}, 750);
				})
				.error(function(data) {
					noty({ type: 'error', text: data.responseText, timeout: 1200 });
				});
		};
	}]);

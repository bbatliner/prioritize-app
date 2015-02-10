'use strict';

angular.module('myTodoAngularApp')
	.controller('LoginController', ['$scope', '$http', '$location', '$timeout', function ($scope, $http, $location, $timeout) {

		$scope.email = '';
		$scope.password = '';
		
		$scope.login = function() {
			var data = {
				email: $scope.email,
				password: $scope.password
			};
			$http.post('/api/login', data)
				.success(function(data) {
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
					noty({ type: 'error', text: data, timeout: 1500 });
				});
		};
	}]);

angular.module('myTodoAngularApp')
	.controller('LoginBarController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

		$scope.logout = function() {
			$http.get('/api/loggedin')
				.success(function(data) {
					// Don't logout if not logged in
					if (data !== '0') {
						$http.post('/api/logout')
							.success(function() {
								noty({ type: 'success', text: 'Successfully logged out.', timeout: 750 });
								$location.url('/');
								$rootScope.user = {};
							});
					}
				});
		}

		$scope.$watch(function() {
			return $rootScope.user;
		}, function() {
			$scope.user = $rootScope.user;
		});
	}]);

angular.module('myTodoAngularApp')
	.controller('LoginBarController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

		$scope.logout = function() {
			$.get('/api/loggedin', function(data) {
				// Don't logout if not logged in
				if (data !== '0') {
					$.post('/api/logout', function() {
						noty({ type: 'success', text: 'Successfully logged out.', timeout: 750 });
						$location.url('/');
						$rootScope.user = {};
						$rootScope.$apply();
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

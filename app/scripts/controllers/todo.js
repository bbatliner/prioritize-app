// Prevent JSHint from linting jQuery and noty
/*global $:false */
/*global noty:false */
'use strict';

angular.module('myTodoAngularApp')
	.controller('TodoController', ['$scope', function ($scope) {

		/* * * LOCAL FUNCTIONS * * */

		// Save todo items in appropriate local storage
		function saveTodos() {
			if (supportsLocalStorage) {
				localStorage.setItem('myTodos', JSON.stringify($scope.todos));
			}
			// Use Base64 encryption for cookie todos
			else {
				document.cookie = 'myTodos=' + window.btoa(JSON.stringify($scope.todos));
			}
		}

		// Hide the edit todo UI
		function hideEditTodoUI(todo) {
			todo.isEditing = false;
		}

		// Reset all input fields
		function resetInputs() {
			$scope.newTodoText = '';
			$scope.newTodoPriority = '';
			$('#newTodoDate').val('');
		}

		// Find the current max id on the todo items
		function getCurrentMaxId() {
			var maxId = 0;
			for (var i = 0; i < $scope.todos.length; i++) {
				var currentTodo = $scope.todos[i];
				var currentId = currentTodo.id;
				if (currentId > maxId) {
					maxId = currentId;
				}
			}
			return maxId;
		}

		// Get cookie from document.cookie *by name*
		function getCookie(name) {
			var value = '; ' + document.cookie;
			var parts = value.split('; ' + name + '=');
			if (parts.length === 2) {
				return parts.pop().split(';').shift();
			}
		}

		function daysBetween(date1, date2) {
		  // One day in milliseconds
		  var msDay =1000 * 60 * 60 * 24;

		  // Convert both dates to milliseconds
		  var msDate1 = date1.getTime();
		  var msDate2 = date2.getTime();

		  // Calculate the difference in milliseconds
		  var msDifference = msDate2 - msDate1;
		    
		  // Convert back to days and return
		  return Math.round(msDifference / msDay); 
		}

		/* * * END LOCAL FUNCTIONS * * */


		/* * * START INITIALIZATION CODE * * */

		$scope.inputTypeDateSupported = window.Modernizr.inputtypes.date;

		var supportsLocalStorage = false;
		// If browser supports localStorage, store todos there
		// otherwise the default storage is cookies
		if(typeof(Storage) !== 'undefined') {
			supportsLocalStorage = true;
		}

		// Models for input fields for new todo item
		$scope.newTodoText = '';
		$scope.newTodoPriority = '';

		// Models for other things
		$scope.todoSortBy = 'duedate';
		$scope.isEditingTodo = false;

		/* 
		TODO Model:
			{
				description: string,
				duedate: Date,
				priority: int
				see Google Doc for more traits
			}
		*/

		// Load initial todos from appropriate source
		if (supportsLocalStorage) {
			$scope.todos = JSON.parse(localStorage.getItem('myTodos'));
		}
		else {
			var myTodosCookie = getCookie('myTodos');
			if (myTodosCookie !== undefined) {
				// Decode Base64 encryption
				$scope.todos = JSON.parse(window.atob(myTodosCookie));
			}
		}
		// In case nothing was loaded, initialize an empty array
		if ($scope.todos === null || $scope.todos === undefined) {
			$scope.todos = [];
		}
		// Set the baseline for the todo item IDs
		$scope.currentMaxId = getCurrentMaxId();

		// Register callback for saving todos when they change
		$scope.$watch('todos.length', function () {
			saveTodos();
		});

		/* * * END INITIALIZATION CODE * * */


		/* * * START CONTROLLER FUNCTIONS * * */

		// Add a new todo itme
		$scope.addNewTodo = function() {

			// Validate inputs
			if ($scope.newTodoText === '') {
				noty({ type: 'error', text: 'Description cannot be blank!', timeout: 1000 });
				return;
			}
			else if ($scope.newTodoPriority === '') {
				noty({ type: 'error', text: 'Priority must be set!', timeout: 1000 });
				return;
			}
			else if ($('#newTodoDate').val() === '') {
				noty({ type: 'error', text: 'Due date must be set!', timeout: 1000 });
				return;
			}

			// Add a new todo to the end of the todos array
			$scope.todos[$scope.todos.length] = {
				id: ++$scope.currentMaxId,
				description: $scope.newTodoText,
				// For some reason, I couldn't get ng-model to work on the duedate.
				// MOST LIKELY CAUSE: I don't understand how Angular $scope works.
				// Anyways, have a jQuery hack until I learn enough to make sense of it.
				duedate: Date.parse($('#newTodoDate').val()).toISOString(),
				priority: $scope.newTodoPriority
			};

			// Reset the input fields
			resetInputs();
		};

		// Show UI for editing a todo
		$scope.startEditingTodo = function(myTodo) {
			myTodo.isEditing = true;
			// Provide a parsed Data object for the edit todo form
			myTodo.editTodoDate = Date.parse(myTodo.todo.duedate);
		};
		// Don't save the edited todo 
		$scope.cancelEditingTodo = function(myTodo) {
			hideEditTodoUI(myTodo);
		};
		// Save the edited todo
		$scope.saveEditingTodo = function(myTodo) {
			// Convert the Date object into a string
			var myDateString = myTodo.editTodoDate.toISOString();
			// Remove the quotation marks
			myTodo.todo.duedate = myDateString;

			saveTodos();
			hideEditTodoUI(myTodo);
		};

		// Remove a todo item
		$scope.removeTodo = function(index) {
			if (index > -1) {
				$scope.todos.splice(index, 1);
			}
		};

		// Compare (ISO-8601) dates
		$scope.getDateString = function(date) {
			// If the date is anytime before today, find out how many days,
			// and return '<days> day(s) overdue'
			var daysBetweenDates = daysBetween(Date.today(), Date.parse(date));
			if (daysBetweenDates < 0) {
				if (daysBetweenDates === -1) {
					return '1 day overdue';
				}
				else {
					return -daysBetweenDates + ' days overdue';
				}
			} 
			// If the date is anytime today, return 'Today'
			else if (Date.today().equals(Date.parse(date).at('0:00'))) {
				return 'Today';
			}
			// If the date is anytime 'tomorrow', return 'Tomorrow'
			else if (Date.parse('tomorrow').equals(Date.parse(date).at('0:00'))) {
				return 'Tomorrow';
			}
			// Otherwise return a formatted date string
			else {
				return Date.parse(date).toString('d MMM \'yy');
			}
		};

		// Get correct color class of priority
		$scope.priorityColorClass = function(priority) {
			priority = parseInt(priority);
			return  priority === 1 ? 'bg-red'
					: priority === 2 ? 'bg-green'
					: priority === 3 ? 'bg-blue'
					: '';
		};

		/* * * END CONTROLLER FUNCTIONS * * */

	}]);

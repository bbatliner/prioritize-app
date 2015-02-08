// Prevent JSHint from linting JS libraries
/*global $:false */
/*global noty:false */
/*global bootbox:false */
'use strict';

angular.module('myTodoAngularApp')
	.controller('TodoController', ['$scope', function ($scope) {

		/* * * LOCAL FUNCTIONS * * */

		// Define a truncate function
		String.prototype.trunc = String.prototype.trunc ||
			function(n){
				return this.length>n ? this.substr(0,n-1)+'...' : this;
			};

		// Save todo items in appropriate local storage
		function saveTodos() {
			// if (supportsLocalStorage) {
			// 	localStorage.setItem('myTodos', JSON.stringify($scope.categoricalTodos));
			// 	localStorage.setItem('myDoneTodos', JSON.stringify($scope.doneCategoricalTodos));
			// }
			var data = {
				"todos": JSON.stringify($scope.categoricalTodos),
				"doneTodos": JSON.stringify($scope.doneCategoricalTodos)
			};
			$.post('/api/todos', data)
				.error(function(data) {
					noty({
						type: 'error',
						text: 'Could not save todos. Click to try again.',
						callback: {
							onCloseClick: function() {
								saveTodos();
							}
						},
						timeout: 5000 });
				});
		}

		// Extract todos in the nested categorical model to a single array
		function extractCategoricalTodos(todos) {
			// Initialize the empty array to hold all of the todos
			var extractedTodos = [];
			// foreach category
			for (var i = 0; i < todos.categories.length; i++) {
				var category = todos.categories[i];
				// foreach todo in the category
				for (var j = 0; j < category.todos.length; j++) {
					var todo = category.todos[j];
					// Store the todo's category in itself
					todo.category = category.name;
					// Add it to the extracted array
					extractedTodos[extractedTodos.length] = todo;
				}
			}
			return extractedTodos;
		}

		// // Compress a single array of todos (with categories properties) into organized categories
		// // Quirky behavior: the category of the todo is left in the todo object, even though it is contained
		// // in a `category` object with a name
		// function compressCategoricalTodos(todos) {
		// 	var compressedTodos = JSON.parse('{ "categories": [] }');
		// 	var usedCategories = [];

		// 	for (var i = 0; i < todos.length; i++) {
		// 		var currentTodo = todos[i];
		// 		var todoCategory = currentTodo.category;
		// 		if ($.inArray(todoCategory, usedCategories) === -1) {
		// 			usedCategories[usedCategories.length] = todoCategory;
		// 			var newCategory = JSON.parse('{ "name": \"' + todoCategory + '\", "todos": [] }');
		// 			for (var j = 0; j < todos.length; j++) {
		// 				var currentTodoToCheck = todos.slice()[j];
		// 				if (currentTodoToCheck.category === todoCategory) {
		// 					newCategory.todos[newCategory.todos.length] = currentTodoToCheck;
		// 				}
		// 			}
		// 			compressedTodos.categories[compressedTodos.categories.length] = angular.copy(newCategory);
		// 		}
		// 	}

		// 	return compressedTodos;
		// }

		// // Take empty categories in the emptyCategories organized array and put them 
		// // in the already-organized categoricalTodos array, but only if they don't exist already
		// function mergeEmptyCategories(categoricalTodos, emptyCategories) {
		// 	for (var i = 0; i < emptyCategories.categories.length; i++) {
		// 		var currentCategory = emptyCategories.categories[i];
		// 		var categoryExists = false;
		// 		for (var j = 0; j < categoricalTodos.categories.length; j++) {
		// 			if (currentCategory.name === categoricalTodos.categories[j].name) {
		// 				categoryExists = true;
		// 				break;
		// 			}
		// 		}
		// 		if (!categoryExists) {
		// 			categoricalTodos.categories[categoricalTodos.categories.length] = currentCategory;
		// 		}
		// 	}
		// 	return categoricalTodos;
		// }

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
			// Search in todos
			for (var i = 0; i < $scope.todos.length; i++) {
				var currentTodo = $scope.todos[i];
				var currentId = currentTodo.id;
				if (currentId > maxId) {
					maxId = currentId;
				}
			}
			// Search in done todos
			for (i = 0; i < $scope.doneTodos.length; i++) {
				var currentDoneTodo = $scope.doneTodos[i];
				var currentDoneId = currentDoneTodo.id;
				if (currentDoneId > maxId) {
					maxId = currentDoneId;
				}
			}
			return maxId;
		}

		function daysBetween(date1, date2) {
			// One day in milliseconds
			var msDay = 1000 * 60 * 60 * 24;

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
		$scope.doneTodoSortBy = 'duedate';
		$scope.isEditingTodo = false;
		$scope.showDoneTodos = false;
		$scope.currentCategory = '';

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
		// if (supportsLocalStorage) {
		// 	if (localStorage.getItem('myTodos') !== null) {
		// 		$scope.categoricalTodos = JSON.parse(localStorage.getItem('myTodos'));
		// 		$scope.todos = extractCategoricalTodos($scope.categoricalTodos);
		// 	}
		// 	else {
		// 		$scope.categoricalTodos = JSON.parse('{ "categories": [] }');
		// 		$scope.todos = [];
		// 	}
		// 	if (localStorage.getItem('myDoneTodos') !== null) {
		// 		$scope.doneCategoricalTodos = JSON.parse(localStorage.getItem('myDoneTodos'));
		// 		$scope.doneTodos = extractCategoricalTodos($scope.doneCategoricalTodos);
		// 	}
		// 	else {
		// 		$scope.doneCategoricalTodos = JSON.parse('{ "categories": [] }');
		// 		$scope.doneTodos = [];
		// 	}
		// }
		$scope.categoricalTodos = JSON.parse('{ "categories": [] }');
		$scope.todos = [];
		$scope.doneCategoricalTodos = JSON.parse('{ "categories": [] }');
		$scope.doneTodos = [];

		$.get('/api/todos', function(data) {
			var tempTodos = data;
			if (tempTodos !== null && tempTodos !== undefined && tempTodos !== '') {
				$scope.categoricalTodos = tempTodos;
				$scope.todos = extractCategoricalTodos($scope.categoricalTodos);
				$scope.$apply();
			}
		});
		$.get('/api/doneTodos', function(data) {
			var tempDoneTodos = data;
			if (tempDoneTodos !== null && tempDoneTodos !== undefined && tempDoneTodos !== '') {
				$scope.doneCategoricalTodos = tempDoneTodos;
				$scope.doneTodos = extractCategoricalTodos($scope.doneCategoricalTodos);
				$scope.$apply();
			}
		});

		// Set the baseline for the todo item IDs
		$scope.currentMaxId = getCurrentMaxId();

		/* * * END INITIALIZATION CODE * * */


		/* * * START CONTROLLER FUNCTIONS * * */

		// Comparator for category filter in ng-repeat
		$scope.categoryComparator = function(expected, actual) {
			// Allow anything to go through the filter if the empty string is the current filter
			// This lets the 'All' tab work correctly
			if (actual === '') {
				return true;
			}
			else {
				return angular.equals(actual, expected);
			}
		};

		// New category
		$scope.newCategory = function() {
			bootbox.prompt('What\'s the name of this project?', function(result) {
				if (result !== null) {
					if (result === '') {
						noty({ type: 'error', text: 'Project title cannot be empty!', timeout: 1200 });
						return;
					}
					var newCategoryName = result;

					// Verify this category name is unique
					for (var i = 0; i < $scope.categoricalTodos.categories.length; i++) {
						if ($scope.categoricalTodos.categories[i].name === newCategoryName) {
							noty({ type: 'error', text: 'Project title already exists!', timeout: 1200 });
							return;
						}
					}

					// Construct the JSON template for the new category
					var newCategory = JSON.parse('{ "name": \"' + newCategoryName + '\", "todos": [] }');

					// Push the new category to the array
					$scope.categoricalTodos.categories[$scope.categoricalTodos.categories.length] = angular.copy(newCategory);
					$scope.doneCategoricalTodos.categories[$scope.doneCategoricalTodos.categories.length] = angular.copy(newCategory);

					// Update current category to the current
					$scope.currentCategory = newCategoryName;

					// Refresh the scope (and the ng-repeats!)
					$scope.$apply();

					// Update the active tab in the UI
					$('#categoryTabs li:last').prev().find('a').tab('show');

					// Save todos
					saveTodos();
				}
			});
		};

		// Rename a category
		$scope.renameCategory = function(category) {
			bootbox.prompt('What\'s the new name for the ' + category + ' project?', function(result) {
				if (result !== null) {
					if (result === '') {
						noty({ type: 'error', text: 'Project title cannot be empty!', timeout: 1200 });
						return;
					}

					// Verify the new name is unique
					for (var h = 0; h < $scope.categoricalTodos.categories.length; h++) {
						if ($scope.categoricalTodos.categories[h].name === result) {
							noty({ type: 'error', text: 'Project title already exists!', timeout: 1200 });
							return;
						}
					}

					// Rename todos in single array
					for (var i = 0; i < $scope.todos.length; i++) {
						if ($scope.todos[i].category === category) {
							$scope.todos[i].category = result;
						}
					}

					// Rename category in categorical array
					for (var j = 0; j < $scope.categoricalTodos.categories.length; j++) {
						if ($scope.categoricalTodos.categories[j].name === category) {
							$scope.categoricalTodos.categories[j].name = result;
						}
					}

					// Refresh the scope (and the ng-repeats!)
					$scope.$apply();

					// Save todos
					saveTodos();

					// Manually click the tab to refresh it - ugly, but it works
					var currentCategories = [];
					$('#categoryTabs li a').each(function() {
						currentCategories.push($(this).text());
					});
					var indexOfTab = currentCategories.indexOf(result);
					$('#categoryTabs li:eq(' + indexOfTab + ')').find('a').click();
				}
			});
		};

		// Remove a category
		$scope.removeCategory = function(category) {
			bootbox.confirm('Are you sure want to delete the ' + category + ' project? Any todos (unfinished or not) in this project will also be deleted.', function(result) {
					if (result) {
						// Store the tab before this that will become active when this one is deleted
						var currentCategories = [];
						$('#categoryTabs li a').each(function() {
							currentCategories.push($(this).text());
						});
						var indexOfNextTabToShow = currentCategories.indexOf(category) - 1;

						// Remove todos from single array
						for (var i = 0; i < $scope.todos.length; i++) {
							if ($scope.todos[i].category === category) {
								$scope.todos.splice(i, 1);
							}
						}

						// Remove category from categorical array
						for (var j = 0; j < $scope.categoricalTodos.categories.length; j++) {
							if ($scope.categoricalTodos.categories[j].name === category) {
								$scope.categoricalTodos.categories.splice(j, 1);
							}
						}

						// Remove done todos from single array
						for (var k = 0; k < $scope.doneTodos.length; k++) {
							if ($scope.doneTodos[k].category === category) {
								$scope.doneTodos.splice(k, 1);
							}
						}

						// Remove done category from done categorical array
						for (var l = 0; l < $scope.doneCategoricalTodos.categories.length; l++) {
							if ($scope.doneCategoricalTodos.categories[l].name === category) {
								$scope.doneCategoricalTodos.categories.splice(l, 1);
							}
						}

						// Refresh the scope (and any ng-repeats!)
						$scope.$apply();

						// Save todos
						saveTodos();

						// Update the active tab in the UI
						var nextTabAnchor = $('#categoryTabs li:eq(' + indexOfNextTabToShow + ')').find('a');
						nextTabAnchor.tab('show');
						nextTabAnchor.click();
					}
			});
		};

		// Change current category of visible todos
		$scope.changeCategory = function(category) { 
			$scope.currentCategory = category;
		};

		// Add a new todo item
		$scope.addNewTodo = function() {

			// Validate inputs
			if ($scope.newTodoText === '') {
				noty({ type: 'error', text: 'Description cannot be blank!', timeout: 1200 });
				return;
			}
			else if ($scope.newTodoPriority === '') {
				noty({ type: 'error', text: 'Priority must be set!', timeout: 1200 });
				return;
			}
			else if ($('#newTodoDate').val() === '') {
				noty({ type: 'error', text: 'Due date must be set!', timeout: 1200 });
				return;
			}

			var newTodo = {
				id: ++$scope.currentMaxId,
				category: $scope.currentCategory,
				description: $scope.newTodoText,
				// For some reason, I couldn't get ng-model to work on the duedate.
				// MOST LIKELY CAUSE: I don't understand how Angular $scope works.
				// Anyways, have a jQuery hack until I learn enough to make sense of it.
				duedate: Date.parse($('#newTodoDate').val()).toISOString(),
				priority: $scope.newTodoPriority
			};

			// Add a new todo to the end of the todos array
			$scope.todos[$scope.todos.length] = newTodo;

			// Add a new todo to the categories array
			for (var i = 0; i < $scope.categoricalTodos.categories.length; i++) {
				var currentCategory = $scope.categoricalTodos.categories[i];
				if (currentCategory.name === $scope.currentCategory) {
					currentCategory.todos[currentCategory.todos.length] = newTodo;
				}
			}

			// Save todos
			saveTodos();

			// Reset the input fields
			resetInputs();
		};

		// Readd a todo to the normal list from the "done todos" one
		$scope.reAddTodo = function(index) {
			// Readd the todo to the single todos array
			var todoToReAdd;
			if (index > -1) {
				todoToReAdd = $scope.doneTodos.splice(index, 1)[0];
				$scope.todos[$scope.todos.length] = todoToReAdd;
			}

			// Readd the todo to the categorical todo array
			for (var i = 0; i < $scope.doneCategoricalTodos.categories.length; i++) {
				var currentDoneCategory = $scope.doneCategoricalTodos.categories[i];
				var indexOfDoneTodo = currentDoneCategory.todos.indexOf(todoToReAdd);
				if (indexOfDoneTodo !== -1) {
					currentDoneCategory.todos.splice(indexOfDoneTodo, 1);
				}
			}
			for (var j = 0; j < $scope.categoricalTodos.categories.length; j++) {
				var currentCategory = $scope.categoricalTodos.categories[j];
				if (currentCategory.name === todoToReAdd.category) {
					currentCategory.todos[currentCategory.todos.length] = todoToReAdd;
				}
			}

			// Save todos
			saveTodos();
		};

		// Finish a todo item
		$scope.finishTodo = function(index) {
			// Move the single todo to the doneTodos array
			var doneTodo;
			if (index > -1) {
				doneTodo = $scope.todos.splice(index, 1)[0];
				$scope.doneTodos[$scope.doneTodos.length] = doneTodo;
			}

			// Move the todo between the categories array
			for (var i = 0; i < $scope.categoricalTodos.categories.length; i++) {
				var currentCategory = $scope.categoricalTodos.categories[i];
				var indexOfTodo = currentCategory.todos.indexOf(doneTodo);
				if (indexOfTodo !== -1) {
					currentCategory.todos.splice(indexOfTodo, 1);
				}
			}
			for (var j = 0; j < $scope.doneCategoricalTodos.categories.length; j++) {
				var currentDoneCategory = $scope.doneCategoricalTodos.categories[j];
				if (currentDoneCategory.name === doneTodo.category) {
					currentDoneCategory.todos[currentDoneCategory.todos.length] = doneTodo;
				}
			}

			// Save todos
			saveTodos();
		};

		// Remove a todo item from the todo list
		$scope.deleteUnfinishedTodo = function(index) {
			// Remove the todo from the single todos array
			var todoToDelete;
			if (index > -1) {
				todoToDelete = $scope.todos.splice(index, 1)[0];
			}

			// Remove the todo from the categories array
			for (var i = 0; i < $scope.categoricalTodos.categories.length; i++) {
				var currentCategory = $scope.categoricalTodos.categories[i];
				var indexOfTodo = currentCategory.todos.indexOf(todoToDelete);
				if (indexOfTodo !== -1) {
					currentCategory.todos.splice(indexOfTodo, 1);
				}
			}

			// Save todos
			saveTodos();
		};

		// Remove a todo item from the done list
		$scope.deleteTodo = function(index) {
			// Remove the todo from the single done todos array
			var doneTodoToDelete;
			if (index > -1) {
				doneTodoToDelete = $scope.doneTodos.splice(index, 1)[0];
			}

			// Remove the done todo from the done categories array
			for (var i = 0; i < $scope.doneCategoricalTodos.categories.length; i++) {
				var currentCategory = $scope.doneCategoricalTodos.categories[i];
				var indexOfTodo = currentCategory.todos.indexOf(doneTodoToDelete);
				if (indexOfTodo !== -1) {
					currentCategory.todos.splice(indexOfTodo, 1);
				}
			}

			// Save todos
			saveTodos();
		};

		// Show UI for editing a todo
		$scope.startEditingTodo = function(myTodo) {
			myTodo.isEditing = true;
			// Provide the description for the form
			myTodo.editDescription = myTodo.todo.description;
			// Provide the priority for the form
			myTodo.editPriority = myTodo.todo.priority;
			// Provide a parsed Data object for the form
			myTodo.editDueDate = Date.parse(myTodo.todo.duedate);
		};
		// Don't save the edited todo 
		$scope.cancelEditingTodo = function(myTodo) {
			hideEditTodoUI(myTodo);
		};
		// Save the edited todo
		$scope.saveEditingTodo = function(myTodo) {
			// Save the edited description
			myTodo.todo.description = myTodo.editDescription;
			// Save the edited priority
			myTodo.todo.priority = myTodo.editPriority;
			// Convert the Date object into a string
			var myDateString = myTodo.editDueDate.toISOString();
			// Save the Date ;)
			myTodo.todo.duedate = myDateString;

			// Save todos
			saveTodos();

			hideEditTodoUI(myTodo);
		};

		$scope.toggleShowDoneTodos = function() {
			$scope.showDoneTodos = !$scope.showDoneTodos;
		};

		$scope.getShowDoneTodosIconClass = function() {
			return $scope.showDoneTodos ? 'glyphicon glyphicon-chevron-up'
										: 'glyphicon glyphicon-chevron-down';
		};

		// Compare (ISO-8601) dates
		$scope.getDateString = function(date) {
			// If the date is anytime before today, find out how many days,
			// and return '<days> day(s) overdue'
			var daysBetweenDates = daysBetween(Date.today().at('0:00'), Date.parse(date).at('0:00'));
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
				return $scope.getFormattedDateString(date);
			}
		};

		$scope.getFormattedDateString = function(date) {
			return Date.parse(date).toString('d MMM \'yy');
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

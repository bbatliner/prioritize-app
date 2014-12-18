"use strict";angular.module("myTodoAngularApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.date"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainController"}).when("/todo-list",{templateUrl:"views/todo.html",controller:"TodoController"}).when("/about",{templateUrl:"views/about.html",controller:"AboutController"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","$window",function(a,b,c){a.$on("$routeChangeSuccess",function(){c.ga("send","pageview",{page:b.path()})})}]),angular.module("myTodoAngularApp").controller("MainController",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("myTodoAngularApp").controller("AboutController",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("myTodoAngularApp").controller("TodoController",["$scope",function(a){function b(){h?(localStorage.setItem("myTodos",JSON.stringify(a.todos)),localStorage.setItem("myDoneTodos",JSON.stringify(a.doneTodos))):document.cookie="myTodos="+window.btoa(JSON.stringify(a.todos))+";myDoneTodos="+window.btoa(JSON.stringify(a.doneTodos))}function c(a){a.isEditing=!1}function d(){a.newTodoText="",a.newTodoPriority="",$("#newTodoDate").val("")}function e(){for(var b=0,c=0;c<a.todos.length;c++){var d=a.todos[c],e=d.id;e>b&&(b=e)}for(c=0;c<a.doneTodos.length;c++){var f=a.doneTodos[c],g=f.id;g>b&&(b=g)}return b}function f(a){var b="; "+document.cookie,c=b.split("; "+a+"=");return 2===c.length?c.pop().split(";").shift():void 0}function g(a,b){var c=864e5,d=a.getTime(),e=b.getTime(),f=e-d;return Math.round(f/c)}a.inputTypeDateSupported=window.Modernizr.inputtypes.date;var h=!1;if("undefined"!=typeof Storage&&(h=!0),a.newTodoText="",a.newTodoPriority="",a.todoSortBy="duedate",a.doneTodoSortBy="duedate",a.isEditingTodo=!1,a.showDoneTodos=!1,h)a.todos=JSON.parse(localStorage.getItem("myTodos")),a.doneTodos=JSON.parse(localStorage.getItem("myDoneTodos"));else{var i=f("myTodos"),j=f("myDoneTodos");void 0!==i&&(a.todos=JSON.parse(window.atob(i))),void 0!==j&&(a.doneTodos=JSON.parse(window.atob(j)))}(null===a.todos||void 0===a.todos)&&(a.todos=[]),(null===a.doneTodos||void 0===a.doneTodos)&&(a.doneTodos=[]),a.currentMaxId=e(),a.addNewTodo=function(){return""===a.newTodoText?void noty({type:"error",text:"Description cannot be blank!",timeout:1e3}):""===a.newTodoPriority?void noty({type:"error",text:"Priority must be set!",timeout:1e3}):""===$("#newTodoDate").val()?void noty({type:"error",text:"Due date must be set!",timeout:1e3}):(a.todos[a.todos.length]={id:++a.currentMaxId,description:a.newTodoText,duedate:Date.parse($("#newTodoDate").val()).toISOString(),priority:a.newTodoPriority},b(),void d())},a.reAddTodo=function(c){if(c>-1){var d=a.doneTodos.splice(c,1)[0];a.todos[a.todos.length]=d}b()},a.finishTodo=function(c){if(c>-1){var d=a.todos.splice(c,1)[0];a.doneTodos[a.doneTodos.length]=d}b()},a.deleteTodo=function(c){c>-1&&a.doneTodos.splice(c,1),b()},a.startEditingTodo=function(a){a.isEditing=!0,a.editDescription=a.todo.description,a.editPriority=a.todo.priority,a.editDueDate=Date.parse(a.todo.duedate)},a.cancelEditingTodo=function(a){c(a)},a.saveEditingTodo=function(a){a.todo.description=a.editDescription,a.todo.priority=a.editPriority;var d=a.editDueDate.toISOString();a.todo.duedate=d,b(),c(a)},a.toggleShowDoneTodos=function(){a.showDoneTodos=!a.showDoneTodos},a.getShowDoneTodosIconClass=function(){return a.showDoneTodos?"glyphicon glyphicon-chevron-up":"glyphicon glyphicon-chevron-down"},a.getDateString=function(b){var c=g(Date.today().at("0:00"),Date.parse(b).at("0:00"));return 0>c?-1===c?"1 day overdue":-c+" days overdue":Date.today().equals(Date.parse(b).at("0:00"))?"Today":Date.parse("tomorrow").equals(Date.parse(b).at("0:00"))?"Tomorrow":a.getFormattedDateString(b)},a.getFormattedDateString=function(a){return Date.parse(a).toString("d MMM 'yy")},a.priorityColorClass=function(a){return a=parseInt(a),1===a?"bg-red":2===a?"bg-green":3===a?"bg-blue":""}}]);
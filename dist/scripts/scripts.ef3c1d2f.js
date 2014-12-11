"use strict";angular.module("myTodoAngularApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/todo.html",controller:"TodoController"}).when("/main",{templateUrl:"views/main.html",controller:"MainController"}).when("/about",{templateUrl:"views/about.html",controller:"AboutController"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]),angular.module("myTodoAngularApp").controller("MainController",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("myTodoAngularApp").controller("AboutController",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("myTodoAngularApp").controller("TodoController",["$scope",function(a){function b(){g?localStorage.setItem("myTodos",JSON.stringify(a.todos)):document.cookie="myTodos="+window.btoa(JSON.stringify(a.todos))}function c(a){a.$isEditing=!1}function d(){a.newTodoText="",a.newTodoPriority="",a.newTodoDate=null}function e(){for(var b=0,c=0;c<a.todos.length;c++){var d=a.todos[c],e=d.id;e>b&&(b=e)}return b}function f(a){var b="; "+document.cookie,c=b.split("; "+a+"=");return 2===c.length?c.pop().split(";").shift():void 0}$();var g=!1;if("undefined"!=typeof Storage&&(g=!0),a.newTodoText="",a.newTodoPriority="",a.newTodoDate=null,a.todoSortBy="duedate",a.isEditingTodo=!1,g)a.todos=JSON.parse(localStorage.getItem("myTodos"));else{var h=f("myTodos");void 0!==h&&(a.todos=JSON.parse(window.atob(h)))}(null===a.todos||void 0===a.todos)&&(a.todos=[]),a.currentMaxId=e(),a.$watch("todos.length",function(){b()}),a.addNewTodo=function(){return""===a.newTodoText?void noty({type:"error",text:"Description cannot be blank!",timeout:1e3}):""===a.newTodoPriority?void noty({type:"error",text:"Priority must be set!",timeout:1e3}):null===a.newTodoDate?void noty({type:"error",text:"Due date must be set!",timeout:1e3}):(a.todos[a.todos.length]={id:++a.currentMaxId,description:a.newTodoText,duedate:a.newTodoDate.toJSON(),priority:a.newTodoPriority},void d())},a.startEditingTodo=function(a){a.$isEditing=!0,a.$editTodoDate=Date.parse(a.todo.duedate)},a.cancelEditingTodo=function(a){c(a)},a.saveEditingTodo=function(a){var d=JSON.stringify(a.$editTodoDate);a.todo.duedate=d.substring(1,d.length-1),b(),c(a)},a.removeTodo=function(b){b>-1&&a.todos.splice(b,1)},a.getDateString=function(a){return Date.today().equals(Date.parse(a).at("0:00"))?"Today":Date.parse("tomorrow").equals(Date.parse(a).at("0:00"))?"Tomorrow":Date.parse(a).toString("d MMM yy")},a.priorityColorClass=function(a){return a=parseInt(a),1===a?"bg-red":2===a?"bg-green":3===a?"bg-blue":""}}]);
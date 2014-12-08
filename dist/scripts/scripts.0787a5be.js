"use strict";angular.module("myTodoAngularApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/todo.html",controller:"TodoCtrl"}).when("/main",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]),angular.module("myTodoAngularApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("myTodoAngularApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("myTodoAngularApp").controller("TodoCtrl",["$scope",function(a){function b(){f?localStorage.setItem("myTodos",JSON.stringify(a.todos)):document.cookie="myTodos="+window.btoa(JSON.stringify(a.todos))}function c(){a.newTodoText="",a.newTodoPriority="",a.newTodoDate=null}function d(){for(var b=0,c=0;c<a.todos.length;c++){var d=a.todos[c],e=d.id;e>b&&(b=e)}return b}function e(a){var b="; "+document.cookie,c=b.split("; "+a+"=");return 2===c.length?c.pop().split(";").shift():void 0}$();var f=!1;if("undefined"!=typeof Storage&&(f=!0),a.newTodoText="",a.newTodoPriority="",a.newTodoDate=null,a.todoSortBy="duedate",f)a.todos=JSON.parse(localStorage.getItem("myTodos"));else{var g=e("myTodos");void 0!==g&&(a.todos=JSON.parse(window.atob(g)))}(null===a.todos||void 0===a.todos)&&(a.todos=[]),a.currentMaxId=d(),a.$watch("todos.length",function(){b()}),a.addNewTodo=function(){return""===a.newTodoText?void noty({type:"error",text:"Description cannot be blank!",timeout:1e3}):""===a.newTodoPriority?void noty({type:"error",text:"Priority must be set!",timeout:1e3}):null===a.newTodoDate?void noty({type:"error",text:"Due date must be set!",timeout:1e3}):(a.todos[a.todos.length]={id:++a.currentMaxId,description:a.newTodoText,duedate:a.newTodoDate.toJSON(),priority:a.newTodoPriority},void c())},a.removeTodo=function(b){b>-1&&a.todos.splice(b,1)}}]);
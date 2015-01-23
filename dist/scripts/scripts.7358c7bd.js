"use strict";angular.module("myTodoAngularApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngDragDrop","ui.date"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainController"}).when("/todo-list",{templateUrl:"views/todo.html",controller:"TodoController"}).when("/about",{templateUrl:"views/about.html",controller:"AboutController"}).when("/help",{templateUrl:"views/help.html",controller:"HelpController"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","$window",function(a,b,c){a.$on("$routeChangeSuccess",function(){c.ga("send","pageview",{page:b.path()})})}]),angular.module("myTodoAngularApp").controller("MainController",function(){}),angular.module("myTodoAngularApp").controller("AboutController",function(){}),angular.module("myTodoAngularApp").controller("HelpController",function(){}),angular.module("myTodoAngularApp").controller("TodoController",["$scope",function(a){function b(){h&&(localStorage.setItem("myTodos",JSON.stringify(a.categoricalTodos)),localStorage.setItem("myDoneTodos",JSON.stringify(a.doneCategoricalTodos)))}function c(a){for(var b=[],c=0;c<a.categories.length;c++)for(var d=a.categories[c],e=0;e<d.todos.length;e++){var f=d.todos[e];f.category=d.name,b[b.length]=f}return b}function d(a){a.isEditing=!1}function e(){a.newTodoText="",a.newTodoPriority="",$("#newTodoDate").val("")}function f(){for(var b=0,c=0;c<a.todos.length;c++){var d=a.todos[c],e=d.id;e>b&&(b=e)}for(c=0;c<a.doneTodos.length;c++){var f=a.doneTodos[c],g=f.id;g>b&&(b=g)}return b}function g(a,b){var c=864e5,d=a.getTime(),e=b.getTime(),f=e-d;return Math.round(f/c)}String.prototype.trunc=String.prototype.trunc||function(a){return this.length>a?this.substr(0,a-1)+"...":this},a.inputTypeDateSupported=window.Modernizr.inputtypes.date;var h=!1;"undefined"!=typeof Storage&&(h=!0),a.newTodoText="",a.newTodoPriority="",a.todoSortBy="duedate",a.doneTodoSortBy="duedate",a.isEditingTodo=!1,a.showDoneTodos=!1,a.currentCategory="",h&&(null!==localStorage.getItem("myTodos")?(a.categoricalTodos=JSON.parse(localStorage.getItem("myTodos")),a.todos=c(a.categoricalTodos)):(a.categoricalTodos=JSON.parse('{ "categories": [] }'),a.todos=[]),null!==localStorage.getItem("myDoneTodos")?(a.doneCategoricalTodos=JSON.parse(localStorage.getItem("myDoneTodos")),a.doneTodos=c(a.doneCategoricalTodos)):(a.doneCategoricalTodos=JSON.parse('{ "categories": [] }'),a.doneTodos=[])),a.currentMaxId=f(),a.categoryComparator=function(a,b){return""===b?!0:angular.equals(b,a)},a.newCategory=function(){bootbox.prompt("What's the name of this project?",function(c){if(null!==c){if(""===c)return void noty({type:"error",text:"Project title cannot be empty!",timeout:1200});for(var d=c,e=0;e<a.categoricalTodos.categories.length;e++)if(a.categoricalTodos.categories[e].name===d)return void noty({type:"error",text:"Project title already exists!",timeout:1200});var f=JSON.parse('{ "name": "'+d+'", "todos": [] }');a.categoricalTodos.categories[a.categoricalTodos.categories.length]=angular.copy(f),a.doneCategoricalTodos.categories[a.doneCategoricalTodos.categories.length]=angular.copy(f),a.currentCategory=d,a.$apply(),$("#categoryTabs li:last").prev().find("a").tab("show"),b()}})},a.renameCategory=function(c){bootbox.prompt("What's the new name for the "+c+" project?",function(d){if(null!==d){if(""===d)return void noty({type:"error",text:"Project title cannot be empty!",timeout:1200});for(var e=0;e<a.categoricalTodos.categories.length;e++)if(a.categoricalTodos.categories[e].name===d)return void noty({type:"error",text:"Project title already exists!",timeout:1200});for(var f=0;f<a.todos.length;f++)a.todos[f].category===c&&(a.todos[f].category=d);for(var g=0;g<a.categoricalTodos.categories.length;g++)a.categoricalTodos.categories[g].name===c&&(a.categoricalTodos.categories[g].name=d);a.$apply(),b();var h=[];$("#categoryTabs li a").each(function(){h.push($(this).text())});var i=h.indexOf(d);$("#categoryTabs li:eq("+i+")").find("a").click()}})},a.removeCategory=function(c){bootbox.confirm("Are you sure want to delete the "+c+" project? Any todos (unfinished or not) in this project will also be deleted.",function(d){if(d){var e=[];$("#categoryTabs li a").each(function(){e.push($(this).text())});for(var f=e.indexOf(c)-1,g=0;g<a.todos.length;g++)a.todos[g].category===c&&a.todos.splice(g,1);for(var h=0;h<a.categoricalTodos.categories.length;h++)a.categoricalTodos.categories[h].name===c&&a.categoricalTodos.categories.splice(h,1);for(var i=0;i<a.doneTodos.length;i++)a.doneTodos[i].category===c&&a.doneTodos.splice(i,1);for(var j=0;j<a.doneCategoricalTodos.categories.length;j++)a.doneCategoricalTodos.categories[j].name===c&&a.doneCategoricalTodos.categories.splice(j,1);a.$apply(),b();var k=$("#categoryTabs li:eq("+f+")").find("a");k.tab("show"),k.click()}})},a.changeCategory=function(b){a.currentCategory=b},a.addNewTodo=function(){if(""===a.newTodoText)return void noty({type:"error",text:"Description cannot be blank!",timeout:1200});if(""===a.newTodoPriority)return void noty({type:"error",text:"Priority must be set!",timeout:1200});if(""===$("#newTodoDate").val())return void noty({type:"error",text:"Due date must be set!",timeout:1200});var c={id:++a.currentMaxId,category:a.currentCategory,description:a.newTodoText,duedate:Date.parse($("#newTodoDate").val()).toISOString(),priority:a.newTodoPriority};a.todos[a.todos.length]=c;for(var d=0;d<a.categoricalTodos.categories.length;d++){var f=a.categoricalTodos.categories[d];f.name===a.currentCategory&&(f.todos[f.todos.length]=c)}b(),e()},a.reAddTodo=function(c){var d;c>-1&&(d=a.doneTodos.splice(c,1)[0],a.todos[a.todos.length]=d);for(var e=0;e<a.doneCategoricalTodos.categories.length;e++){var f=a.doneCategoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}for(var h=0;h<a.categoricalTodos.categories.length;h++){var i=a.categoricalTodos.categories[h];i.name===d.category&&(i.todos[i.todos.length]=d)}b()},a.finishTodo=function(c){var d;c>-1&&(d=a.todos.splice(c,1)[0],a.doneTodos[a.doneTodos.length]=d);for(var e=0;e<a.categoricalTodos.categories.length;e++){var f=a.categoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}for(var h=0;h<a.doneCategoricalTodos.categories.length;h++){var i=a.doneCategoricalTodos.categories[h];i.name===d.category&&(i.todos[i.todos.length]=d)}b()},a.deleteUnfinishedTodo=function(c){var d;c>-1&&(d=a.todos.splice(c,1)[0]);for(var e=0;e<a.categoricalTodos.categories.length;e++){var f=a.categoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}b()},a.deleteTodo=function(c){var d;c>-1&&(d=a.doneTodos.splice(c,1)[0]);for(var e=0;e<a.doneCategoricalTodos.categories.length;e++){var f=a.doneCategoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}b()},a.startEditingTodo=function(a){a.isEditing=!0,a.editDescription=a.todo.description,a.editPriority=a.todo.priority,a.editDueDate=Date.parse(a.todo.duedate)},a.cancelEditingTodo=function(a){d(a)},a.saveEditingTodo=function(a){a.todo.description=a.editDescription,a.todo.priority=a.editPriority;var c=a.editDueDate.toISOString();a.todo.duedate=c,b(),d(a)},a.toggleShowDoneTodos=function(){a.showDoneTodos=!a.showDoneTodos},a.getShowDoneTodosIconClass=function(){return a.showDoneTodos?"glyphicon glyphicon-chevron-up":"glyphicon glyphicon-chevron-down"},a.getDateString=function(b){var c=g(Date.today().at("0:00"),Date.parse(b).at("0:00"));return 0>c?-1===c?"1 day overdue":-c+" days overdue":Date.today().equals(Date.parse(b).at("0:00"))?"Today":Date.parse("tomorrow").equals(Date.parse(b).at("0:00"))?"Tomorrow":a.getFormattedDateString(b)},a.getFormattedDateString=function(a){return Date.parse(a).toString("d MMM 'yy")},a.priorityColorClass=function(a){return a=parseInt(a),1===a?"bg-red":2===a?"bg-green":3===a?"bg-blue":""},a.priorityTranslucentColorClass=function(a){return a=parseInt(a),1===a?"bg-red-translucent":2===a?"bg-green-translucent":3===a?"bg-blue-translucent":""}}]);
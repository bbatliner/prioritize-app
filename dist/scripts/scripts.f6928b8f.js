"use strict";var checkLoggedin=["$q","$http","$location","$rootScope",function(a,b,c,d){var e=a.defer();return b.get("/api/loggedin").success(function(a){"0"!==a?(d.user=a,e.resolve()):(d.user=!1,e.reject(),c.url("/login"))}),e.promise}];angular.module("myTodoAngularApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.date"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainController"}).when("/todo-list",{templateUrl:"views/todo.html",controller:"TodoController",resolve:{loggedin:checkLoggedin}}).when("/about",{templateUrl:"views/about.html",controller:"AboutController"}).when("/help",{templateUrl:"views/help.html",controller:"HelpController"}).when("/signup",{templateUrl:"views/signup.html",controller:"SignupController"}).when("/login",{templateUrl:"views/login.html",controller:"LoginController"}).when("/me",{templateUrl:"views/me.html",controller:"MeController",resolve:{loggedin:checkLoggedin}}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","$window",function(a,b,c){a.$on("$routeChangeSuccess",function(){c.ga("send","pageview",{page:b.path()})})}]),angular.module("myTodoAngularApp").controller("MainController",function(){}),angular.module("myTodoAngularApp").controller("AboutController",function(){}),angular.module("myTodoAngularApp").controller("HelpController",function(){}),angular.module("myTodoAngularApp").controller("TodoController",["$scope","$http",function(a,b){function c(){var d={todos:JSON.stringify(a.categoricalTodos),doneTodos:JSON.stringify(a.doneCategoricalTodos)};b.post("/api/todos",d).error(function(){noty({type:"error",text:"Could not save todos. Click to try again.",callback:{onCloseClick:function(){c()}},timeout:5e3})})}function d(a){for(var b=[],c=0;c<a.categories.length;c++)for(var d=a.categories[c],e=0;e<d.todos.length;e++){var f=d.todos[e];f.category=d.name,b[b.length]=f}return b}function e(a){a.isEditing=!1}function f(){a.newTodoText="",a.newTodoPriority="",$("#newTodoDate").val("")}function g(){for(var b=0,c=0;c<a.todos.length;c++){var d=a.todos[c],e=d.id;e>b&&(b=e)}for(c=0;c<a.doneTodos.length;c++){var f=a.doneTodos[c],g=f.id;g>b&&(b=g)}return b}function h(a,b){var c=864e5,d=a.getTime(),e=b.getTime(),f=e-d;return Math.round(f/c)}String.prototype.trunc=String.prototype.trunc||function(a){return this.length>a?this.substr(0,a-1)+"...":this},a.inputTypeDateSupported=window.Modernizr.inputtypes.date,a.newTodoText="",a.newTodoPriority="",a.todoSortBy="duedate",a.doneTodoSortBy="duedate",a.isEditingTodo=!1,a.showDoneTodos=!1,a.currentCategory="",a.categoricalTodos=JSON.parse('{ "categories": [] }'),a.todos=[],a.doneCategoricalTodos=JSON.parse('{ "categories": [] }'),a.doneTodos=[],b.get("/api/todos").success(function(b){var c=b;null!==c&&void 0!==c&&""!==c&&(a.categoricalTodos=c,a.todos=d(a.categoricalTodos)),a.currentMaxId=g()}),b.get("/api/doneTodos").success(function(b){var c=b;null!==c&&void 0!==c&&""!==c&&(a.doneCategoricalTodos=c,a.doneTodos=d(a.doneCategoricalTodos)),a.currentMaxId=g()}),a.categorySortable={tolerance:"intersect",distance:20,stop:function(){c()}},a.categoryComparator=function(a,b){return""===b?!0:angular.equals(b,a)},a.newCategory=function(){bootbox.prompt("What's the name of this project?",function(b){if(null!==b){if(""===b)return void noty({type:"error",text:"Project title cannot be empty!",timeout:1200});for(var d=b,e=0;e<a.categoricalTodos.categories.length;e++)if(a.categoricalTodos.categories[e].name===d)return void noty({type:"error",text:"Project title already exists!",timeout:1200});var f=JSON.parse('{ "name": "'+d+'", "todos": [] }');a.categoricalTodos.categories[a.categoricalTodos.categories.length]=angular.copy(f),a.doneCategoricalTodos.categories[a.doneCategoricalTodos.categories.length]=angular.copy(f),a.currentCategory=d,a.$apply(),$("#categoryTabs li:last").find("a").tab("show"),$("#allTabs").children(".active").removeClass("active"),$("#allTabs > li a").blur(),c()}})},a.renameCategory=function(b){bootbox.prompt("What's the new name for the "+b+" project?",function(d){if(null!==d){if(""===d)return void noty({type:"error",text:"Project title cannot be empty!",timeout:1200});for(var e=0;e<a.categoricalTodos.categories.length;e++)if(a.categoricalTodos.categories[e].name===d)return void noty({type:"error",text:"Project title already exists!",timeout:1200});for(var f=0;f<a.todos.length;f++)a.todos[f].category===b&&(a.todos[f].category=d);for(var g=0;g<a.categoricalTodos.categories.length;g++)a.categoricalTodos.categories[g].name===b&&(a.categoricalTodos.categories[g].name=d);a.$apply(),c();var h=[];$("#categoryTabs li a").each(function(){h.push($(this).text())});var i=h.indexOf(d);$("#categoryTabs li:eq("+i+")").find("a").click()}})},a.removeCategory=function(b){bootbox.confirm("Are you sure want to delete the "+b+" project? Any todos (unfinished or not) in this project will also be deleted.",function(d){if(d){var e=[];$("#categoryTabs li a").each(function(){e.push($(this).text())});for(var f=e.indexOf(b)-1,g=0;g<a.todos.length;g++)a.todos[g].category===b&&a.todos.splice(g,1);for(var h=0;h<a.categoricalTodos.categories.length;h++)a.categoricalTodos.categories[h].name===b&&a.categoricalTodos.categories.splice(h,1);for(var i=0;i<a.doneTodos.length;i++)a.doneTodos[i].category===b&&a.doneTodos.splice(i,1);for(var j=0;j<a.doneCategoricalTodos.categories.length;j++)a.doneCategoricalTodos.categories[j].name===b&&a.doneCategoricalTodos.categories.splice(j,1);if(a.$apply(),c(),-1===f)var k=$("#allTab").find("a");else var k=$("#categoryTabs li:eq("+f+")").find("a");k.tab("show"),k.click()}})},a.changeCategory=function(b){a.currentCategory=b},a.addNewTodo=function(){if(""===a.newTodoText)return void noty({type:"error",text:"Description cannot be blank!",timeout:1200});if(""===a.newTodoPriority)return void noty({type:"error",text:"Priority must be set!",timeout:1200});if(""===$("#newTodoDate").val())return void noty({type:"error",text:"Due date must be set!",timeout:1200});var b={id:++a.currentMaxId,category:a.currentCategory,description:a.newTodoText,duedate:Date.parse($("#newTodoDate").val()).toISOString(),priority:a.newTodoPriority};a.todos[a.todos.length]=b;for(var d=0;d<a.categoricalTodos.categories.length;d++){var e=a.categoricalTodos.categories[d];e.name===a.currentCategory&&(e.todos[e.todos.length]=b)}c(),f()},a.reAddTodo=function(b){var d;b>-1&&(d=a.doneTodos.splice(b,1)[0],a.todos[a.todos.length]=d);for(var e=0;e<a.doneCategoricalTodos.categories.length;e++){var f=a.doneCategoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}for(var h=0;h<a.categoricalTodos.categories.length;h++){var i=a.categoricalTodos.categories[h];i.name===d.category&&(i.todos[i.todos.length]=d)}c()},a.finishTodo=function(b){var d;b>-1&&(d=a.todos.splice(b,1)[0],a.doneTodos[a.doneTodos.length]=d);for(var e=0;e<a.categoricalTodos.categories.length;e++){var f=a.categoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}for(var h=0;h<a.doneCategoricalTodos.categories.length;h++){var i=a.doneCategoricalTodos.categories[h];i.name===d.category&&(i.todos[i.todos.length]=d)}c()},a.deleteUnfinishedTodo=function(b){var d;b>-1&&(d=a.todos.splice(b,1)[0]);for(var e=0;e<a.categoricalTodos.categories.length;e++){var f=a.categoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}c()},a.deleteTodo=function(b){var d;b>-1&&(d=a.doneTodos.splice(b,1)[0]);for(var e=0;e<a.doneCategoricalTodos.categories.length;e++){var f=a.doneCategoricalTodos.categories[e],g=f.todos.indexOf(d);-1!==g&&f.todos.splice(g,1)}c()},a.startEditingTodo=function(a){a.isEditing=!0,a.editDescription=a.todo.description,a.editPriority=a.todo.priority,a.editDueDate=Date.parse(a.todo.duedate)},a.cancelEditingTodo=function(a){e(a)},a.saveEditingTodo=function(a){a.todo.description=a.editDescription,a.todo.priority=a.editPriority;var b=a.editDueDate.toISOString();a.todo.duedate=b,c(),e(a)},a.toggleShowDoneTodos=function(){a.showDoneTodos=!a.showDoneTodos},a.getShowDoneTodosIconClass=function(){return a.showDoneTodos?"glyphicon glyphicon-chevron-up":"glyphicon glyphicon-chevron-down"},a.getDateString=function(b){var c=h(Date.today().at("0:00"),Date.parse(b).at("0:00"));return 0>c?-1===c?"1 day overdue":-c+" days overdue":Date.today().equals(Date.parse(b).at("0:00"))?"Today":Date.parse("tomorrow").equals(Date.parse(b).at("0:00"))?"Tomorrow":a.getFormattedDateString(b)},a.getFormattedDateString=function(a){return Date.parse(a).toString("d MMM 'yy")},a.priorityColorClass=function(a){return a=parseInt(a),1===a?"bg-red":2===a?"bg-green":3===a?"bg-blue":""},a.priorityTranslucentColorClass=function(a){return a=parseInt(a),""},$("#allTabs a").click(function(a){null!==a.target.firstChild&&null!==a.target.firstChild.data&&void 0!==a.target.firstChild.data&&($(this).parent("li").addClass("active"),$("#categoryTabs").find(".active").removeClass("active"))}),$("#categoryTabs").click(function(){$("#allTabs").children(".active").removeClass("active"),$("#allTabs > li a").blur()})}]),angular.module("myTodoAngularApp").controller("SignupController",["$scope","$timeout","$location","$http",function(a,b,c,d){a.firstName="",a.lastName="",a.email="",a.password="",a.signup=function(){var e={firstName:a.firstName,lastName:a.lastName,email:a.email,password:a.password};d.post("/api/signup",e).success(function(){noty({type:"success",text:"Successfully signed up!",timeout:1200}),b(function(){c.path("/todo-list")},750)}).error(function(a){noty({type:"error",text:a,timeout:1200})})}}]),angular.module("myTodoAngularApp").controller("LoginController",["$scope","$http","$location","$timeout",function(a,b,c,d){a.email="",a.password="",a.login=function(){var e={email:a.email,password:a.password};b.post("/api/login",e).success(function(){noty({type:"success",text:"Successfully logged in!",timeout:1e3}),d(function(){c.path("/todo-list")},750)}).error(function(a){noty({type:"error",text:a,timeout:1500})})}}]),angular.module("myTodoAngularApp").controller("MeController",["$scope","$rootScope",function(a,b){a.user=b.user,a.userStartDate=Date.parse(a.user.createdAt).toString("MMMM d, yyyy")}]),angular.module("myTodoAngularApp").controller("LoginBarController",["$scope","$rootScope","$http","$location",function(a,b,c,d){a.logout=function(){c.get("/api/loggedin").success(function(a){"0"!==a&&c.post("/api/logout").success(function(){noty({type:"success",text:"Successfully logged out.",timeout:750}),d.url("/"),b.user={}})})},a.$watch(function(){return b.user},function(){a.user=b.user})}]);
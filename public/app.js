var app = angular.module('whattodo',['ngRoute','ngCookies','ui.bootstrap','angularModalService']);

app.config(function($routeProvider,$locationProvider){
    
    $locationProvider.hashPrefix(''); 

    $routeProvider
    .when('/', {
        templateUrl: 'structure/home.html',
        controller: 'homeCtrl',
    })
    .when('/login', {
        templateUrl: 'structure/login.html',
        controller: 'loginCtrl',
    })
    .when('/signup', {
        templateUrl: 'structure/signup.html',
        controller: 'signupCtrl',
    })
    .when('/about', {
        templateUrl: 'structure/about.html',
        controller: 'aboutCtrl',
    })
    .when('/createtodo', {
        templateUrl: 'structure/createtodo.html',
        controller: 'todoCtrl',
    })
    .when('/viewtodo', {
        templateUrl: 'structure/viewtodo.html',
        controller: 'todoCtrl',
    })
    .when('/myprofile', {
        templateUrl: 'structure/myprofile.html',
        controller: 'myprofileCtrl',
    })
    .when('/userdashboard', {
        templateUrl: 'structure/userdashboard.html',
        controller: 'userdashboardCtrl',
    })
    .when('/editprofile', {
        templateUrl: 'structure/editprofile.html',
        controller: 'editprofileCtrl',
    })
    .when('/edittodo/:id', {
        templateUrl: 'structure/edittodo.html',
        controller: 'todoCtrl',
    });
});



//  app.factory('EditTodo', function() {

//     // private
//     var todo = {};

//     // public
//     return {
      
//       getTodo: function() {
//         return todo;
//       },
      
//       setTodo: function(td) {
//         todo = td;
//       }
      
//     };
//   });


// app.service('dataService', function() {
//   // private variable
//   var _dataObj = {};
  
//   this.dataObj = _dataObj;
// });



app.run(function($rootScope,$cookies){
    if ($cookies.get('token') && $cookies.get('currentUser')){
        $rootScope.token = $cookies.get('token');
        $rootScope.currentUser = $cookies.get('currentUser')
    }
});

app.controller('wtdCtrl',function($rootScope,$scope,$http,$cookies){
        $scope.logout = function(){
                        $cookies.remove('token');
                        $cookies.remove('currentUser');
                        $rootScope.token = null;
                        $rootScope.currentUser = null;   
                }
});

app.controller('homeCtrl',function(){

});


app.controller('loginCtrl',function($rootScope,$scope,$http,$cookies){
    $scope.signin = function(){
                    $http.put('/users/signin',{email: $scope.user.email, password: $scope.user.password})
                    .then(function(res){
                        //  console.log(res.data.username);
                        //  alert(res.data.username);
                        $cookies.put('token',res.data.token);
                        $cookies.put('currentUser',res.data.username);
                        $rootScope.token = res.data.token;
                        $rootScope.currentUser = res.data.username;
                        alert('successfully signed in');
                    },function(err){
                        alert('bad login credentials');
                    });
                };
});


app.controller('signupCtrl',function($scope,$http){
    $scope.signup = function(){
        if($scope.newUser.password==$scope.newUser.ConfirmPassword){
                  var newUser = {
                        username: $scope.newUser.firstName,
                        lastname: $scope.newUser.lastName,
                        email: $scope.newUser.email,
                        password: $scope.newUser.password,
                    };

                    $http.post('/users',newUser).then(function(){
                        alert('success');
                    });
  
        }
        else{
            alert('password should match');
        }

  }

});


app.controller('aboutCtrl',function(){

});

// app.controller('createtodoCtrl',function($rootScope,$scope,$http,$cookies){
//     $scope.createtodo = function(){
//       var newTodo = {
//           todotitle: $scope.user.ToDoTitle,
//           tododesc: $scope.user.ToDoDesc,
//           tododone: $scope.user.ToDoDone
//       };  
      
//     //   alert(newTodo.todotitle);
//     //   alert(newTodo.tododesc);
//     //   alert(newTodo.tododone);

//       $http.post('/todos',newTodo,{headers: {'authorization': $rootScope.token}}).then(function(){
//           //alert('success');
//       },function(){
//         alert('something wrong');
//       });
            

//     };
   
   
// });

app.controller('todoCtrl',function($rootScope,$scope,$http,$cookies,ModalService,$routeParams,$routeParams){
    
    $scope.show = function(modeltitle,modeldesc,modeldone) {
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalController",
            inputs: {
                modeltitle: modeltitle,
                modeldesc: modeldesc,
                modeldone: modeldone
            }
        }).then(function(modal) {

            modal.element.modal();
            modal.close.then(function() {
                // $scope.message = "You said " + result;
                //console.log('success');
            });
        });
    };


    $scope.createtodo = function(){
        // console.log($scope.user.ToDoTitle);
        // console.log($scope.user.ToDoDesc);
        // console.log($scope.user.ToDoDone);
      var newTodo = {
          todotitle: $scope.user.ToDoTitle,
          tododesc: $scope.user.ToDoDesc,
          tododone: $scope.user.ToDoDone
      };  
      
    //   alert(newTodo.todotitle);
    //   alert(newTodo.tododesc);
    //   alert(newTodo.tododone);

      $http.post('/todos',newTodo,{headers: {'authorization': $rootScope.token}}).then(function(){
          //alert('success');
      },function(){
        alert('something wrong');
      });
            

    };

    $scope.removeTodo = function(todo){
                    $http.put('/todos/remove',
                    {todo: todo},
                     {headers: {
                         'authorization': $rootScope.token
                    }}).then(function(){
                        getTodos();
                    });
                };            

    // $scope.user = {};            

    // $scope.edittodo = function(todo){
    //                 // $http.put('/todos/edit',
    //                 // {todo: todo},
    //                 //  {headers: {
    //                 //      'authorization': $rootScope.token
    //                 // }}).then(function(){
    //                 //     getTodos();
    //                 // });
    //                 var id = $routeParams.id;
    //                 console.log('todo is here');
    //                 console.log(todo);
    //                 console.log(id);
    //                 console.log($scope.user.ToDoTitle);
    //                 console.log($scope.user.ToDoDesc);
    //                 console.log($scope.user.ToDoDone);

    //                 $scope.user.ToDoTitle = todo.todotitle;
    //                 $scope.user.ToDoDesc = todo.tododesc;
    //                 $scope.user.ToDoDone = todo.tododone;
                    
    //                 console.log($scope.user.ToDoTitle);
    //                 console.log($scope.user.ToDoDesc);
    //                 console.log($scope.user.ToDoDone);

                    // console.log($scope.todotitle);
                    // console.log($scope.tododesc);
                    // console.log($scope.tododone);
                    
                    // $scope.todotitle = todo.todotitle;
                    // $scope.tododesc = todo.tododesc;
                    // $scope.tododone = todo.tododone;

                    // console.log($scope.todotitle);
                    // console.log($scope.tododesc);
                    // console.log($scope.tododone);
                    
                    

                    //  EditTodo.setTodo(todo);
                    //  $rootScope.$broadcast('edit-todo-event');
                // };
    

    $scope.showTodos = function(){
                    var id = $routeParams.id;
                    $http.get('/todos/'+ id
                    ,{headers: {
                         'authorization': $rootScope.token
                    }}
                     ).then(function(response){
                         console.log('in the showTodos');
                         console.log(response.data);
                        $scope.user = response.data;
                    });
                };

    $scope.updateTodo = function(){
                    var id = $routeParams.id;
                    $http.put('/todos/'+ id , $scope.user).then(function(response){
                        //$scope.employee = response.data;
                        window.location.href = '/viewtodo';
                    });
                };


    function getTodos(){
                    $http.get('/todos',
                    {headers: {
                         'authorization': $rootScope.token
                    }}).then(function(response){
                         $scope.todos = response.data;
                        //alert('successfully read todos from db');
                        //console.log(response.data);

                    },function(){
                        //alert('error while reading db');
                    });
                }

                getTodos();
});

// app.controller('edittodoCtrl',function($rootScope,$scope,$cookies,$http,EditTodo){
//     //console.log(EditTodo.getTodo());
//     var getTodoVal = EditTodo.getTodo();
//         console.log(getTodoVal.tododesc);

//         //$scope.user.ToDoDesc = getTodoVal.tododesc;

//     $scope.$on('edit-todo-event',function(){
//         getTodoVal = EditTodo.getTodo();
//         console.log(getTodoVal.todotitle);
//         $scope.user.ToDoTitle = getTodoVal.todotitle;
//         $scope.user.ToDoDesc = getTodoVal.tododesc;
//         $scope.user.ToDoDone = getTodoVal.tododone;
        
//     });


// });

// app.controller('PopupCont',function($scope,$modalInstance){
//     $scope.close = function () {
//                 $modalInstance.dismiss('cancel');
//             };
// });

app.controller('ModalController', function($scope, modeltitle, modeldesc, modeldone, close) {
  
 $scope.modeltitle=modeltitle; 
 $scope.modeldesc=modeldesc;
 $scope.modeldone=modeldone;
 $scope.close = function(result) {
 	close(result, 500); // close, but give 500ms for bootstrap to animate
 };

});

app.controller('myprofileCtrl',function(){

});

app.controller('userdashboardCtrl',function(){

});

app.controller('editprofileCtrl',function(){

});
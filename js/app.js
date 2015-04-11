
// yourModule
//   .config(function($httpProvider){
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
// });

var url = "http://192.168.43.51:8080";

var app = angular.module('angularProject', ['ngRoute','ngTable'])
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/registration', {
        templateUrl: 'app/partials/registration.html',
        controller: 'registrationController'
      }).
      when('/login', {
        templateUrl: 'app/partials/login.html',
        controller: 'loginController'
      }).
      when('/home', {
        templateUrl: 'app/partials/homePage.html',
        controller: 'homeController'
      }).
      when('/content', {
        templateUrl: 'app/partials/content.html',
        controller: 'contentController'
      }).
      when('/contentInfo/:diary', {
        templateUrl: 'app/partials/contentDetail.html',
        controller: 'contentInfoController'
      }).
      when('/other', {
        templateUrl: 'app/partials/other.html',
        controller: 'PostDiaryCtrl'
      }).
      when('/new', {
        templateUrl: 'app/partials/createNewOne.html',
        controller: 'newController'
      }).
      when('/', {
        redirectTo: '/home'

      }).
      otherwise({
        redirectTo: '/'
      })
  }],
    ['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }],
    ['$httpProvider',function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]
  )


    app.factory('Service', ['$http','$location', function($http,$location){
            var api = {
                login : function(scope) {  
                     return $http.get(url+'/DiaryS/rest/api/userlog/'+scope.data.username+"/"+scope.data.password)
                     .success(function(data) {
                        if (data == "success") {
                            scope.commonData.state = 100;
                            scope.commonData.user = {
                                username:scope.data.username
                            }
                           $location.path('/content');
                        } else {
                            alert("username or password wrong");
                        }
                        console.log(data);
                }).error(function(data) {
             console.log(user);
                });
         },register : function(scope) {  
                     return $http.get(url+"/DiaryS/rest/api/registerwa/"+scope.data.username+"/"+scope.data.password)
                     .success(function(data) {
                        if (data == "success") {
                            scope.commonData.state = 100;
                            scope.commonData.user = {
                                username:scope.data.username
                            }
                           $location.path('/content');
                        } else if (data == "failed") {
                            alert("username have been used");
                        } else {
                            alert("try later");

                        }
                        console.log(data);
             }).
          error(function(data) {
             console.log(data);

          });
         }, getDiaries : function(scope) {  
                     return $http.get(url+'/DiaryS/rest/api/getallDiary/'+scope.commonData.user.username)
                     .success(function(data) {
                    scope.diaries = data;
                    console.log(scope.diaries);

             }).
          error(function(data) {
             // console.log(user);
          });
         }, deleteDiary : function(diary_id, scope) {  
                     return $http.get(url+'/DiaryS/rest/api/deletewa/'+diary_id)
                     .success(function(data) {
                    console.log(scope.diaries);
            angular.forEach(scope.diaries, function (item, key) {
                if (item.id == diary_id) {
                    console.log(item)
                    scope.diaries.splice(key, 1);       
                    return;
                }
            });

             }).
          error(function(data) {
console.log(scope.diaries);
            angular.forEach(scope.diaries, function (item, key) {
                if (item.id == diary_id) {
                    console.log(item)
                    scope.diaries.splice(key, 1);       
                    return;
                }
            });          });
         }, postDiary : function(scope) { 
                             console.log(url+'/DiaryS/rest/api/creatediarywa/'
                        +scope.commonData.user.username+"/"+scope.data.title
                        +"/"+scope.data.blog);
 
                     return $http.get(url+'/DiaryS/rest/api/creatediarywa/'
                        +scope.commonData.user.username+"/"+scope.data.title
                        +"/"+scope.data.blog)
                     .success(function(data) {
                   $location.path('/content');
                    console.log(scope.diaries);
             }).
          error(function(data) {
             // console.log(user);
              $location.path('/content');

          });
         }




        }
            return api
        }]);


    app.controller('PostDiaryCtrl', ['$scope', '$location','Service','commonData',
        function ($scope,$location, Service, commonData) {
        
        $scope.postDiary = function(){
            console.log("register");
            $scope.commonData = commonData;


         //    var myDate = new Date();  
         // console.log(myDate.toLocaleString());
            $scope.blog = {
            name:$scope.commonData.user.username,
            title:$scope.data.title,
            content:$scope.data.blog,
            // date:myDate.toLocaleString()
          };
           console.log($scope.blog);
          Service.postDiary($scope);
        };
    }]);

    app.controller('contentInfoController', ['$scope', '$routeParams',
           function($scope,$routeParams) {
            $scope.info = $routeParams.diary;
                       // console.log($scope.info);
          }]);
    app.controller('registrationController', 
        ['$scope', '$location','Service','commonData',
        function ($scope,$location, Service, commonData) {
        $scope.commonData = commonData;
        $scope.register = function(){
            console.log('http://localhost:8080/DiaryS/rest/api/registerwa/'+$scope.data.username+"/"+$scope.data.password);
            Service.register($scope);
        }
        
    }]);
   
    app.factory('commonData', function(){
        return {
            type : 'commonData',
            users : [{username:'www', password:'111111'}],
            state : 0,
            user : {},
            stockCodes : []
        };

    })

    app.controller('indexController', 
        ['$scope','commonData',
        function ($scope, commonData) {
        $scope.commonData = commonData;
        $scope.loginOut = function(){
        $scope.commonData.state = 0;
            // console.log("gurdjief");
        };
    }]);

    app.controller('otherController', 
        ['$scope', 'Service','commonData',
        function ($scope, Service, commonData) {
    }]);


    app.controller('newController', 
        ['$scope','$location', 'Service','commonData',
        function ($scope, $location, Service, commonData) {
    }]);

    app.controller('homeController', 
        ['$scope', 'Service',
        function ($scope, Service) {

       

    }]);


            


    app.controller('contentController', 
        ['$scope', 'Service','commonData',
        function ($scope, Service, commonData) {
        $scope.commonData = commonData;
         Service.getDiaries($scope);
        $scope.delete = function(id){
        Service.deleteDiary(id, $scope)
    };
    }]);





    app.controller('loginController', 
        ['$scope', '$location','Service','commonData',
        function ($scope,  $location, Service, commonData) {
        $scope.commonData = commonData;
        $scope.login = function(){
        // console.log('http://192.168.43.51:8080/DiaryS/rest/api/userlog/'+user.username+"/"+user.password);
        Service.login($scope)
    };

       

    }]);

    app.controller('homeController', 
        ['$scope', 'Service',
        function ($scope, Service) {

       

    }]);



    

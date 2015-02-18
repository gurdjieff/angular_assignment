var app = angular.module('angularProject', ['ngRoute'])
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
      when('/', {
        templateUrl: 'app/partials/homePage.html',
        controller: 'homeController'
      }).
      when('/content', {
        templateUrl: 'app/partials/content.html',
        controller: 'contentController'
      }).
      otherwise({
        redirectTo: '/'
      })
  }])


    app.filter('cityFilter', function () {
        return function (data, value) {
            var filterData = [];

            angular.forEach(data, function (obj) {
                if (value === "country") {
                    if (obj.id === "country") {
                    filterData.push(obj);
                    }
                } else {
                    if (obj.id === "city" && obj.Country === value) {
                    filterData.push(obj);
                    }
                }      
            })
           
            return filterData;
        }
    })

    

    app.directive('customTextArea',function(){
        return {
            restrict:'E',
            template:'<div contenteditable="true"></div>',
            replace:true,
            require : 'ngModel',
            link:function(scope,elm,attrs,ngModelController){


                // view->model
                elm.on('keyup',function(){
                    scope.$apply(function(){
                        ngModelController.$setViewValue(elm.html());
                    });
                })

                ngModelController.$render = function(){
                    elm.html(ngModelController.$viewValue);
                }

            }
        };
    })

    app.factory('LocationService', ['$http' , function($http){
            var api = {
                getCities : function() {  
                     return $http.get('../localData/irelandCities.json')
                },
                getHobbies : function() {  
                     return $http.get('../localData/hobbies.json')
                },

                getCommonData : function() {  
                    var commonData = [];
                     return commonData;
                }
            }
            return api
        }]);



    app.controller('loginController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {


        // LocationService.getCommonData().success(function(data){
        //     $scope.commonData = data;
        // })


        $scope.login = function(){
         

            console.log($scope.data)
                        console.log($scope.commonData)

        }
       

    }]);

    app.controller('homeController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {

       

    }]);



    app.controller('registrationController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {

        LocationService.getCities().success(function(data){
            $scope.cities = data;
        })

        LocationService.getHobbies().success(function(data){
            $scope.hobbies = data;
        })

        // LocationService.getCommonData().success(function(data){
        //     $scope.commonData = data;
        // })

        $scope.users = [];
        $scope.register = function(){
          $scope.users.push({
            username:$scope.data.username,
            email:$scope.data.email,
            sex:$scope.data.sex,
            statement:$scope.data.statement,
            blog:$scope.data.blog,
            age:$scope.data.age
          });
          $scope.commonData.users = $scope.users;
            console.log($scope.users)
            $scope.myForm.$setPristine();
            var returnKey = confirm('register success, enter to main page');
                if(returnKey){
                    window.location.href = "#/content";
                }
        }
      
        $scope.data = {
            // hobbies: [1, 2],
            // city: 3
        };


        $scope.origData = angular.copy($scope.data);

        $scope.reset = function(){
            $scope.data = angular.copy($scope.origData);
            // that.initCity();
            
        }

    }]);

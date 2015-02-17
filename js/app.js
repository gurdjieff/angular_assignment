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
           

            console.log(filterData);

            return filterData;
        }
    })

    app.directive('even',function(){
        return {
            require : 'ngModel',
            link:function(scope,elm,attrs,ngModelController){
                ngModelController.$parsers.push(function(viewValue){
                    if(viewValue % 2 === 0){
                        ngModelController.$setValidity('even',true);
                    }else{
                        ngModelController.$setValidity('even',false);
                    }
                    return viewValue;
                });

//                ngModelController.$formatters.push(function(modelValue){
//                    return modelValue + 'kittencup';
//                })
            }
        };
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
                getCities : function() {  // NEW
                     return $http.get('../localData/irelandCities.json')
                },
                getHobbies : function() {  // NEW
                     return $http.get('../localData/irelandCities.json')
                }
            }
            return api
        }]);



    app.controller('loginController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {

       

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
            $scope.countries = []; 

            angular.forEach(data, function(value, key){
                $scope.countries.push(key);
            })

            console.log($scope.cities);

        })

        $scope.users = [];
        $scope.register = function(){
          $scope.users.push();
          //   name: $scope.newRegister.username,
          //   password: new_id,
          //   hobbies: $scope.newRegister.password,
          // })
          console.log($scope.data)
        }


    
          
        
                    // console.log($scope.data);

        var that = this;

        $scope.hobbies = [
            {
                id: 1,
                name: 'play'
            },
            {
                id: 2,
                name: 'watch TV '
            },
            {
                id: 3,
                name: 'reading'
            },
        ];

      


        $scope.data = {
            hobbies: [1, 2],
            city: 3
        };


        $scope.origData = angular.copy($scope.data);

        $scope.reset = function(){

            // $scope.data = angular.copy($scope.origData);
            // that.initCity();
            $scope.myForm.$setPristine();
        }


        

        $scope.toggleHobbySelection = function (id) {

            var index = -1;
            if ($scope.data.hobbies === undefined) {
                $scope.data.hobbies = [];
            } else {
                index = $scope.data.hobbies.indexOf(id);
            }

            if (index === -1) {
                $scope.data.hobbies.push(id);
            } else {
                $scope.data.hobbies.splice(index, 1);
            }

        }
    }]);

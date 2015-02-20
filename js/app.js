
var app = angular.module('angularProject', ['ngRoute', 'angular-loading-bar','ngTable'])
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
      when('/other', {
        templateUrl: 'app/partials/other.html',
        controller: 'otherController'
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
    }]

    ,['$cfpLoadingBarProvider',function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
  }]

  )


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

    

    app.directive('myTextArea',function(){
        return {
            restrict:'E',
            template:'<textarea class="form-control" rows="3" cols="20"></textarea>',
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
                getStockCodes : function() {  
                     return $http.get('../localData/stockCode.json')
                }
            }
            return api
        }]);

   
    app.factory('commonData', function(){
        return {
            type : 'commonData',
            users : [{username:'www', password:'111111'}],
            state : 0,
            stockCodes : []
        };

    })

    app.controller('indexController', 
        ['$scope', 'LocationService','commonData',
        function ($scope, LocationService, commonData) {

        $scope.commonData = commonData;
        $scope.loginOut = function(){
        $scope.commonData.state = 0;

            console.log("gurdjief");
        };
    }]);

    app.controller('otherController', 
        ['$scope', 'LocationService','commonData',
        function ($scope, LocationService, commonData) {

    


    }]);


    app.controller('newController', 
        ['$scope','$location', 'LocationService','commonData','cfpLoadingBar',
        function ($scope, $location, LocationService, commonData,cfpLoadingBar) {

        $scope.commonData = commonData;
        $scope.createNewOne = function(){
            console.log($scope.data)
            // $scope.$apply(function(){
            $scope.commonData.stockCodes.push({
            code:$scope.data.code,
            market:$scope.data.market,
            price:$scope.data.price*700,
            vibration:$scope.data.vibration*100,
          });
        cfpLoadingBar.start();
        setTimeout(function(){
             $location.path('/content');
                cfpLoadingBar.complete();
             }, 1000);
        };

    


    }]);

    app.controller('homeController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {

       

    }]);


            


    app.controller('contentController', 
        ['$scope', 'LocationService','commonData','NgTableParams',
        function ($scope, LocationService, commonData, NgTableParams) {

        $scope.commonData = commonData;
        $scope.stockCodes = [];

         LocationService.getStockCodes().success(function(data){
            if ($scope.commonData.stockCodes.length == 0) {
                $scope.commonData.stockCodes = data;
            };
            $scope.data = $scope.commonData.stockCodes;


            $scope.tableParams = new NgTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })


        var findIndex = function (code) {
            var index = -1;

            angular.forEach($scope.commonData.stockCodes, function (item, key) {
                if (item.code === code) {
                    console.log(code)
                                        console.log(key)

                    index = key;
                    return;
                }
            });

            return index;
        }

        var resetTableParams = function(){

            return {
                    total: $scope.data.length, // length of data
                    getData: function($defer, params) {
                        $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        }

        $scope.remove = function (id) {
            var index = findIndex(id);
            console.log(index)
            if (index !== -1) {
                $scope.commonData.stockCodes.splice(index, 1);



                $scope.tableParams = new NgTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, 
               resetTableParams()); 
            }
        }

        $scope.averagePrice = function () {
            var total = 0;
            angular.forEach($scope.commonData.stockCodes, function (item) {
                total += item.price;
            })
            return total/($scope.commonData.stockCodes.length);
        }

    }]);





    app.controller('loginController', 
        ['$scope', '$location','LocationService','commonData','cfpLoadingBar',
        function ($scope,  $location, LocationService, commonData,cfpLoadingBar) {

        $scope.commonData = commonData;

        $scope.login = function(){
         
        angular.forEach($scope.commonData.users, function (obj) {
            if ($scope.data.username === obj.username
                && $scope.data.password === obj.password) {

                $scope.commonData.state = 1
                cfpLoadingBar.start();
                setTimeout(function(){
                 $location.path('/content');
                    cfpLoadingBar.complete();
                 }, 1000);

            }
            })}
       

    }]);

    app.controller('homeController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {

       

    }]);



    app.controller('registrationController', 
        ['$scope', '$location','LocationService','commonData','cfpLoadingBar',
        function ($scope,$location, LocationService, commonData,cfpLoadingBar) {

        LocationService.getCities().success(function(data){
            $scope.cities = data;
        })

        LocationService.getHobbies().success(function(data){
            $scope.hobbies = data;
        })

        $scope.commonData = commonData;


        

        $scope.users = [];
        $scope.register = function(){
          $scope.commonData.users.push({
            username:$scope.data.username,
            email:$scope.data.email,
            sex:$scope.data.sex,
            statement:$scope.data.statement,
            blog:$scope.data.blog,
            age:$scope.data.age,
            password:$scope.data.password

          });
            // $scope.myForm.$setPristine();
            $scope.commonData.state = 1
             cfpLoadingBar.start();
                setTimeout(function(){
                 $location.path('/content');
                    cfpLoadingBar.complete();
        }, 1000);
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

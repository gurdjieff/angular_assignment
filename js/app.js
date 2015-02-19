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
                }
            }
            return api
        }]);

   
    app.factory('commonData', function(){
        return {
            type : 'commonData',
            users : [{username:'www', password:'111111'}],
            state : 0
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

    app.controller('homeController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {

       

    }]);

    app.controller('contentController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {
        $scope.peoples = [
            {name: "Maria Silva Santos", city: "Sao Paulo", email: "maria@angular.com", github: "maria", description: "is a web developer and PHP Evangelist"},
            {name: "Pedro Mendes da Silva", city: "Salvador", email: "pedro@angular.com", github: "pedro", description: "Application Developer in Information Technology"},
            {name: "Marcos Medeiros", city: "Parnaiba", email: "joao@angular.com", github: "marcos", description: "Amazon Evangelist for Latin America. Software Engineer"},
            {name: "Cleber Santos", city: "Barueri", email: "cleber@angular.com", github: "cleber", description: "Developer and IT consultant"},
        ];
       

    }]);





    app.controller('loginController', 
        ['$scope', '$location','LocationService','commonData',
        function ($scope,  $location, LocationService, commonData) {

        $scope.commonData = commonData;

        $scope.login = function(){
         
        angular.forEach($scope.commonData.users, function (obj) {
            if ($scope.data.username === obj.username
                && $scope.data.password === obj.password) {
                var returnKey = confirm('login success, enter to main page');
                if(returnKey){
                    // window.location.href = "#/content";
                $location.path('/home');
            }

                $scope.commonData.state = 1

            }
                
        // console.log($scope.data)
        // console.log($scope.commonData)
                // console.log($scope)
            })}
       

    }]);

    app.controller('homeController', 
        ['$scope', 'LocationService',
        function ($scope, LocationService) {

       

    }]);



    app.controller('registrationController', 
        ['$scope', '$location','LocationService','commonData',
        function ($scope,$location, LocationService, commonData) {

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
            $scope.myForm.$setPristine();
            var returnKey = confirm('register success, enter to main page');
                if(returnKey){
                $location.path('#/home');
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

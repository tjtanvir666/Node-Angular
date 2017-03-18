(function(){

	angular.module('appRoute',['ngRoute'])

	.config(function($routeProvider,$locationProvider){

		$routeProvider

			.when('/',{
				templateUrl: 'app/views/pages/home.html',
				controller: 'mainController',
				controllerAs: 'main'
			})

			.when('/login',{
				templateUrl: 'app/views/pages/login.html'
				// controller: 'mainController',
				// controllerAs: 'login'
			})	

			.when('/signup',{
				templateUrl: 'app/views/pages/signup.html'
			})
	})


})();


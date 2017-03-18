(function(){

	 // create the module and name it amarApp
 	var myApp = angular.module('myApp', ['appRoute','mainCtrl', 'authService', 'userCtrl', 'storyCtrl', 'storyService']) //no need to inject 'userService' here as it is injected in the 'userCtrl'

 	.config(function($httpProvider){

 		$httpProvider.interceptors.push('AuthInterceptor')

 	})


})();
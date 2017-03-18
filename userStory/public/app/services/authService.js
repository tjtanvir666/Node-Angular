//console.log("this is the authService")
/**read about factory, a factory can be called inside another*/

(function () {
	
	angular.module('authService', [])
                                          //the factory AuthToken is passed in here
	.factory('Auth', function ($http, $q, AuthToken) {  //Auth is the factory name q is the promise object //fetching api form the server
		
		var authFactory = {};       //all of the api routes will be put in this authFacotry variable
		
		authFactory.login = function(username, password){
			return $http.post('/api/login', {
				username: username,
				password: password
			})
			.success(function(data){   //this is a promise funciton and the data is a promise object
				AuthToken.setToken(data.token)  //calling the AuthToken factory that is chained to this
				return data;
			})
		};

		authFactory.logout = function(){
			AuthToken.setToken();    //this will clear the token when we logout
		}

		authFactory.isLoggedIn = function(){  //checking id the user is logged in
			if(AuthToken.getToken()){
				return true;
			}
			else{
				return false;
			}	 
		}
		
		authFactory.getUser =function(){
			if(AuthToken.getToken()){
				return $http.get('/api/me');
			}
			else{
				return $q.reject({message: "User has no token"});
			}
		}

		return authFactory;  //should be returned for future use
	})

              //another factory chained to the first one  , this one will get and set tokens
	.factory('AuthToken', function($window){  //window gets the token from the browser
		
		var authTokenFactory = {};
		
		authTokenFactory.getToken = function(){
			return $window.localStorage.getItem('token'); //geting the token saved in the local storage of the browser
		}

		authTokenFactory.setToken = function(token){
			if(token){
				$window.localStorage.setItem('token', token); //saving the token in the browser local storage
			}else{
				$window.localStorage.removeItem('token');
			}
		}

		return authTokenFactory;
	}) 
 

	.factory('AuthInterceptor', function($q, $location, AuthToken){

		var interceptorFactory = {};

		interceptorFactory.request = function(config){
			var token = AuthToken.getToken();

			if(token){
				config.headers['x-access-token'] = token
			}

			return config;
		};

		interceptorFactory.responseError = function(){
			if(response.status == 403){
				$location.path('/login');

				return $q.rejected(response);
			}
		};

		return interceptorFactory;
	});



})(); //end of IFFIE
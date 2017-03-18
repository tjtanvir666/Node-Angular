(function(){

	angular.module('mainCtrl', [])

	.controller('mainController', function($rootScope, $location, Auth){

		var  vm = this;  //this referes to the MainController

		vm.loggedIn = Auth.isLoggedIn();
                        //this rootScope is the one that will show the username (i guess)
		$rootScope.$on('$routeChangeStart', function(){   // checking user logged in for every request //route cahnge is a event listener
			vm.loggedIn = Auth.isLoggedIn();   //this vm refers to $rootScope
			Auth.getUser() 
				.then(function(data){
					vm.user = data.data;
				});
		})

		vm.doLogin = function(){
			vm.processing = true;
			vm.error = '';
			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data){
					vm.processing = false;

					Auth.getUser()
						.then(function(data){
							vm.user = data.data;
						});
					if(data.success){
						$location.path('/');
					}else{
						vm.error = data.message;
					}
				});
		}

		vm.doLogout = function(){
			Auth.logout();
			$location.path('/logout');
		}

	

	})


})();
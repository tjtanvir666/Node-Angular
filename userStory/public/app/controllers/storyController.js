angular.module('storyCtrl', ['storyService'])

.controller('storyController', function(Story,$scope){  //the Story object is from the injected storyService

	var vm = this;

	Story.getStories()
	     .success(function(data){
	     	console.log(data);
	     	$scope.allStories = data;   //this was the mistake to show the contents
	     });

	vm.createStory = function(){
		vm.message = '';
		Story.create(vm.storyData)
			 .success(function(data){
			 	
			 	vm.storyData = ''; //clears up the form on success

			 	vm.message = data.message;

			 	//vm.stories.push(data); 
			 });
	}; 

}) 
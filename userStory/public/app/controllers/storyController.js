angular.module('storyCtrl', ['storyService'])

.controller('storyController', function(Story){  //the Story object is from the injected storyService

	var vm = this;

	Story.getStories()
	     .success(function(data){
	     	vm.stories = data;
	     });

	vm.createStory = function(){
		vm.message = '';
		Story.create(vm.storyData)
			 .success(function(data){
			 	
			 	vm.storyData = ''; //clears up the form on success

			 	vm.message = data.message;

			 	vm.stories.push(data); 
			 });
	}; 

}) 
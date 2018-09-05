(function() {
  'use strict';
  angular.module('core').factory('Toast', Toast);

  Toast.$inject = ['$rootScope','$timeout','$ionicPopup','$ionicLoading','$cordovaToast'];

  function Toast($rootScope, $timeout, $ionicPopup,$ionicLoading, $cordovaToast) {

    var service = {
      show:show
    };
    return service;

	  function show(message,duration,position) {

	    message = message || 'There was an error..';
	    duration = duration || 2000;
	    position = position || 'top';


	  	//$cordovaToast.show(message, duration, position);
      $ionicLoading.show({
          template: message,
          duration:duration
      });
	    
		}
	}


})();

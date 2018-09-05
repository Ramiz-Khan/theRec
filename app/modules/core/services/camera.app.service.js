(function() {
  'use strict';
  angular.module('core').factory('CameraService',CameraService);

  CameraService.$inject = ['$cordovaCamera','$q','$window'];

  function CameraService($cordovaCamera,$q,$window){
    var options = {
     allowEdit: false,
     destinationType: Camera.DestinationType.DATA_URL,
     encodingType: Camera.EncodingType.JPEG,
     targetWidth: 300,
     targetHeight: 300,
     saveToPhotoAlbum: true,
     popoverOptions: CameraPopoverOptions,
   };

    var service = {
      getPicture:getPicture

    };

    return service;

    function getType(type){
      return (type === 0)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY;
    }

    function getPicture(type) {
      var deferred = $q.defer();
      options.sourceType = getType(type);
      $cordovaCamera.getPicture(options).then(function(imageData) {
        deferred.resolve(imageData);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

  }

})();

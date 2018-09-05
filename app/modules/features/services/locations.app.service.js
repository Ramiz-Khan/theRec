(function() {
  'use strict';
  angular.module('features').factory('Locations',Locations);
  Locations.$inject = ['$http','$q','$timeout','$cordovaGeolocation'];


  function Locations($http,$q,$timeout,$cordovaGeolocation) {
    var locations = {
      currentLocation: {
        latlng:['12.9667','77.5667']
      },
      nearbyPlaces:[{
        latlng:['12.9667','77.5667']
      }]

    };

    var service = {
      getLocations:getLocations

    };

    return service;


    function getLocations() {
      var deferred = $q.defer();
      $timeout(function(){
        if(window.cordova) {
          var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            locations.currentLocation.latlng = [lat,long];
            locations.places = [{latlng:[lat,long]}];
            deferred.resolve(locations);
          }, function(err) {
            deferred.resolve(locations);
          });
        } else if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var long  = position.coords.longitude;
            locations.currentLocation.latlng = [lat,long];
            locations.places = [{latlng:[lat,long]}];
            deferred.resolve(locations);
          },function(error){
            deferred.resolve(locations);
          });

        } else {
          deferred.resolve(locations);
        }

      });

      return deferred.promise;


    }



  }

})();

(function() {
  'use strict';

  angular.module('features').controller('MapsCtrl', MapsCtrl);

  MapsCtrl.$inject = ['$scope','$timeout','$stateParams','$log','Menus','Locations'];

  function MapsCtrl($scope, $timeout, $stateParams, $log,Menus,Locations) {
      var vm = this;
      vm.menus = Menus;
      vm.maps = {markers:[]};
      vm.showAutoPlaces = true;


      activate();

      function activate() {
        vm.locationData = Locations.getLocations();

      }

      function initLocation() {
        vm.locationData.then(function(locationData) {
          var coords = locationData.currentLocation.latlng;
          var latlng = new google.maps.LatLng(coords[0],coords[1]);

          _.each(locationData.places,function(place){
            var marker = new google.maps.Marker({
              position: latlng,
              map: vm.maps.map,
              icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
              animation: google.maps.Animation.DROP

            });
            vm.maps.markers.push(marker);

          });

          vm.maps.map.setCenter(latlng);
          vm.maps.map.setZoom(15);
        });
      }



      function clearMarkers() {
        if(vm.maps.map){
          _.each(vm.maps.markers,function(marker){
            marker.setMap(null);
          });
          vm.maps.markers = [];
        }
      }
      function addMarker(place) {
        var marker = new google.maps.Marker({
          map: vm.maps.map,
          position: place.geometry.location,
          icon: {
            url: 'http://maps.gstatic.com/mapfiles/circle.png',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(10, 17)
          }
        });
        vm.maps.markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
          vm.maps.service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.error(status);
              return;
            }
            vm.maps.infoWindow.setContent(result.name);
            vm.maps.infoWindow.open(vm.maps.map, marker);
          });
        });
      }

      function getNearbyPlaces(options) {
        //get the last marker
        var types = options || ['restaurant','cafe'];

        var request = {
          bounds: vm.maps.map.getBounds(),
          types:types
        };
        vm.maps.service.radarSearch(request, function(results,status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
          }
          vm.maps.markers = [];
          for (var i = 0, result; result = results[i]; i++) {
            addMarker(result);
          }

        });




      }

      vm.showNearbyPlaces = function(type) {
        var gTypes=[];
        if(type === 'food') {
          gTypes = ['restaurant','cafe'];
        } else if (type === 'shops') {
          gTypes = ['store','food'];
        }
        clearMarkers();
        getNearbyPlaces(gTypes);

      };

      vm.tabSelected = function(selection) {
        if(!vm.maps.map) {
          return;
        }
        if(selection === 'auto') {
          clearMarkers();
          initLocation();
          vm.showAutoPlaces = true;

        } else {
          clearMarkers();
          getNearbyPlaces();
          vm.showAutoPlaces = false;
        }
      };

      $scope.placeChanged = function() {
        //Adddress within the map
        var place = this.getPlace();


        var latlng = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());

        vm.geoname = place.name;
        vm.maps.map.setCenter(latlng);
        vm.maps.map.setZoom(15);
        var marker = new google.maps.Marker({
          position: latlng,
          map: vm.maps.map,
          icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'

        });
        vm.maps.markers = [marker];


      };



      $scope.$on('mapInitialized', function(event, map) {
        $log.info('Map Initialized');
        vm.maps.map = map;
        vm.maps.service = new google.maps.places.PlacesService(map);
        vm.maps.infoWindow = new google.maps.InfoWindow();
        initLocation();

      });




  }

})();

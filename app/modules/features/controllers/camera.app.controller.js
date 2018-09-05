(function() {
  'use strict';

  angular.module('features').controller('CameraCtrl', CameraCtrl);

  CameraCtrl.$inject = ['$scope','$timeout','$stateParams','$log','Menus','Toast','Auth','$window','CameraService','$sce'];

  function CameraCtrl($scope, $timeout, $stateParams,$log,Menus,Toast,Auth,$window,CameraService,$sce) {
      var vm = this;
      vm.menus = Menus;
      vm.photos=[];

      vm.getMedia = function(type) {
        CameraService.getPicture(type).then(function(imageData) {
          var data =  'data:image/jpeg;base64,' + imageData;
          vm.photos.push(data);

        }, function(err) {
          $log.error(err);
          Toast.show('Error in Selecting Picture:',err);

        });

      };






  }

})();

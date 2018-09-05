(function() {
  'use strict';
  angular.module('users').controller('GalleryCtrl',GalleryCtrl);

  GalleryCtrl.$inject = ['$scope','$stateParams','$timeout','$q','Menus','UserGraph','$ionicScrollDelegate','$ionicLoading'];

  function GalleryCtrl($scope, $stateParams, $timeout,$q,Menus,UserGraph,$ionicScrollDelegate,$ionicLoading) {

    var vm = this;
    vm.menus = Menus;
    vm.imgCache = {};
    activate();
    function activate() {
      UserGraph.getPhotos().then(function(photos){

        var imageLoaders = [];

        _.each(photos,function(photo){
          (function(photo) {

            var promise = $q(function(resolve,reject) {
              var img = new Image();

              img.onload = function(){
                photo.height = img.height;
                photo.width = img.width;
                resolve(img);

              };
              img.src = photo.location;

            });
            imageLoaders.push(promise);


          })(photo);
      });
      $q.all(imageLoaders)
      .then(function(data) {
        vm.photos = photos;
      });




    });




  }//activate



} //GalleryCtrl


})();

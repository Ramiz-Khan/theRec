(function() {
  'use strict';

  angular.module('core').controller('FeaturesCtrl', FeaturesCtrl);

  FeaturesCtrl.$inject = ['$scope','$timeout','$stateParams','Menus'];

  function FeaturesCtrl($scope, $timeout, $stateParams, Menus) {
      var vm = this;
      vm.menus = Menus;
      activate();

      function activate() {
        vm.features = [
          {name:'Profile',link:'app.profile'},
          {name:'Feeds',link:'app.feeds'},
          {name:'Friends',link:'app.friends'},
          {name:'Gallery',link:'app.gallery'},
          {name:'Maps',link:'app.maps'},
          {name:'Notification',link:'app.notifications'},
          {name:'AdMob',link:'app.admob'},
          {name:'Camera',link:'app.camera'}

        ];

      }

  }

})();

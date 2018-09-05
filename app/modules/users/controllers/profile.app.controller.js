(function() {
  'use strict';
  angular.module('users').controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$rootScope','$scope','$stateParams','$timeout','Menus','Auth','UserGraph'];

  function ProfileCtrl($rootScope,$scope, $stateParams, $timeout,Menus,Auth,UserGraph) {
    // Set Header
    var vm = this;
    vm.menus = Menus;
    vm.user = Auth.user;

    activate();

    function activate() {
      UserGraph.getFollowing().then(function(following) {
        vm.following = following;
      });

      UserGraph.getProfile().then(function(profile) {
        vm.profile = profile;
      });


    }


  }

})();

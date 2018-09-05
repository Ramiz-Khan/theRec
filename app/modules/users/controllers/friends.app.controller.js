(function() {
  'use strict';
  angular.module('users').controller('FriendsCtrl',FriendsCtrl);

  FriendsCtrl.$inject = ['$scope','$stateParams','$timeout','Menus','UserGraph'];

  function FriendsCtrl($scope, $stateParams, $timeout,Menus,UserGraph) {

    var vm = this;
    vm.menus = Menus;

    activate();
    function activate() {
      UserGraph.getFriends().then(function(friends){
        vm.friends = friends;
      });


    }


 }


})();

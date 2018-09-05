(function() {
  'use strict';
  angular.module('users').controller('FeedsCtrl',FeedsCtrl);

  FeedsCtrl.$inject = ['$scope','$stateParams','$timeout','Menus','$ionicHistory','UserGraph'];

  function FeedsCtrl($scope, $stateParams, $timeout,Menus,$ionicHistory,UserGraph) {

    var vm = this;

    vm.menus = Menus;

    activate();
    function activate() {
      UserGraph.getFeeds().then(function(feeds) {
        vm.feeds = feeds;
      });


    }


 }


})();

(function() {
  'use strict';

  angular.module('core').controller('HeaderCtrl', HeaderCtrl);

  HeaderCtrl.$inject = ['$scope','$rootScope','$state','$ionicHistory','Menus','Auth'];

  function HeaderCtrl($scope,$rootScope,$state,$ionicHistory,Menus,Auth) {
    var vm = this;
    vm.menus = Menus;
    vm.isLoggedIn = Auth.isLoggedIn;
    activate();

    function activate() {

    }

    vm.signout = function() {
      Auth.signOut();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
          historyRoot:true,
          disableBack:true
      });
      if(!Auth.isLoggedIn()) {
        $state.go('app.login');
      }

    };

    $rootScope.$on('auth:signout',function(){
      $state.go('app.login');
    });
  }

})();

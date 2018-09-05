(function() {
  'use strict';
  angular.module('users').controller('PasswordCtrl', PasswordCtrl);

  PasswordCtrl.$inject = ['$rootScope','$scope','$stateParams','$timeout','Menus','Auth','Toast','$ionicLoading'];

  function PasswordCtrl($rootScope,$scope, $stateParams, $timeout,Menus,Auth,Toast,$ionicLoading) {
    // Set Header
    var vm = this;
    vm.menus = Menus;
    vm.user = Auth.user;

    activate();

    function activate() {

    }

    vm.changePassword = function(credentials) {
      if (credentials.newPassword === credentials.confirmNewPassword) {
        credentials.email = vm.user.email;
        $ionicLoading.show({
            template: 'Please wait...'
        });
        Auth.changePassword(credentials)
        .then(function(response){
          $ionicLoading.hide();
          Toast.show('Password Changed Successfully',1000);
        })
        .catch(function(error) {
          Toast.show(error);
        });
      } else {
        Toast.show('New Passwords do not match',1000);
      }
    };


  }

})();

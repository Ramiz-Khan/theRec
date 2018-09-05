(function() {
  'use strict';

  angular.module('users').controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope','$rootScope','$timeout','$state','$stateParams','Menus','$log','$ionicModal','$templateCache','Auth','$ionicLoading','Toast','$ionicHistory','$cordovaSplashscreen'];

  function LoginCtrl($scope,$rootScope, $timeout,$state, $stateParams, Menus,$log, $ionicModal,$templateCache,Auth,$ionicLoading,Toast,$ionicHistory,$cordovaSplashscreen) {
      var TAG = 'LoginCtrl:';
      var vm = this;
      vm.menus = Menus;

      activate();

      function activate() {
        $log.debug(TAG,'activate');
        if(navigator.splashscreen) {
            $timeout(function() {
              $cordovaSplashscreen.hide();
            },300);
        }

        var signinTemplate = $templateCache.get('modules/users/views/signin.modal.app.view.html');
        vm.signinModal = $ionicModal.fromTemplate(signinTemplate, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        var signupTemplate = $templateCache.get('modules/users/views/signup.modal.app.view.html');
        vm.signupModal = $ionicModal.fromTemplate(signupTemplate, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        var recoverTemplate = $templateCache.get('modules/users/views/recover.modal.app.view.html');
        vm.recoverModal = $ionicModal.fromTemplate(recoverTemplate, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        if(Auth.isLoggedIn()) {
          $ionicHistory.nextViewOptions({
            historyRoot:true,
            disableBack:true
          });
          $timeout(function() {

            $state.go('app.profile');
          },300);
        }

      }


      vm.login = function() {
        vm.signinModal.show();
      };

      vm.recover = function() {
        vm.recoverModal.show();
      };

      vm.signIn = function(credentials) {
        if (credentials && credentials.email && credentials.password) {
            $ionicLoading.show({
                template: 'Signing In...'
            });
            Auth.signIn(credentials)
            .then(function (user) {
                $log.debug('Logged in as:'+ user);
                $ionicLoading.hide();
                Toast.show('Logged In');
                vm.signinModal.hide();
                $ionicHistory.nextViewOptions({
                  historyRoot:true,
                  disableBack:true
                });
                $state.go('app.profile');
            }).catch(function (error) {
                $log.debug(error);
                $ionicLoading.hide();
                Toast.show(error);
            });
        } else {
            Toast.show('Please enter credentials');

        }


      };


      vm.oauthSignin = function(provider) {
        Auth.oauthSignIn(provider).then(function(user) {
          $log.debug('Logged in as:' , user);

          $ionicHistory.nextViewOptions({
            historyRoot:true,
            disableBack:true
          });

          $state.go('app.profile');
        }).catch(function(error) {
          $log.debug(error);
          Toast.show(error);
          $log.debug('Authentication failed:', error);
        });

      };

      vm.signUp = function() {
        vm.signupModal.show();
      };

      vm.closeSignupModal = function() {
        vm.signupModal.hide();
      };

      vm.closeLoginModal = function() {
        vm.signinModal.hide();
      };

      vm.closeRecoverModal = function() {
        vm.recoverModal.hide();
      };



      vm.createUser = function(credentials) {
         $log.debug('Create credentials Function called');
         if (credentials && credentials.username && credentials.email && credentials.password) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            Auth.createUser(credentials)
            .then(function (user) {
                $log.debug('Created User as:', user);
                $ionicLoading.hide();
                Toast.show('Logged In');
                vm.signupModal.hide();
                $ionicHistory.nextViewOptions({
                  historyRoot:true,
                  disableBack:true
                });
                $state.go('app.profile');
            }).catch(function (error) {
                //alert("Error: " + error);
                $log.debug(error);
                Toast.show('Signup Error:' + error);
                $ionicLoading.hide();
            });
          } else {
            Toast.show('Please Enter Credentials');
          }
      };

      vm.forgot = function(credentials){
        Auth.forgot(credentials).then(function() {
          $log.debug('Password Reset Email sent');
          Toast.show('Reset Password Email Sent',2000,'center');
          vm.signinModal.hide();

        }).catch(function(error){
          $log.debug('Error in reseting password',error);
          Toast.show(error);
        });
      };

      vm.signout = function() {
        Auth.signOut().then(function() {
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({
            historyRoot:true,
            disableBack:true
          });
          $state.go('app.login');
        })
        .catch(function(error) {
          Toast.show('Logout Error:' + error);
        });

      };

      vm.skip = function() {
        $rootScope.isAppPreview = true;
        Auth.user.displayName='Guest';
        Auth.user.email='guest@ionicplus.com';
        $state.go('app.profile');
      };


      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        vm.signinModal.remove();
        vm.signupModal.remove();
        vm.recoverModal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

  }

})();

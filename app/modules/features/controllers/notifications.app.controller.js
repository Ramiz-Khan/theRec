(function() {
  'use strict';

  angular.module('features').controller('NotificationsCtrl', NotificationsCtrl);

  NotificationsCtrl.$inject = ['$scope','$timeout','$stateParams','$log','Menus','OneSignalService','IonicService','Toast','Auth','$ionicLoading'];

  function NotificationsCtrl($scope, $timeout, $stateParams,$log,Menus, OneSignalService,IonicService,Toast,Auth,$ionicLoading) {
      var vm = this;

      /* Following Code is for OneSignal Notifications */
      vm.oneSignalPayload = {
        title:'IonicPlus Notification',
        content:'This is a test for profile page',
        data:{page:'app.profile',urlHash:'#/app/profile'},
        userId:'',
        pushToken:''
      };

      vm.initOneSignalNotification = function() {
        $ionicLoading.show({template:'Registering User. Please Wait...'});
        OneSignalService.init()
        .then(function(ids){
          $ionicLoading.hide();
          $log.info('OneSignalNotificationInited:',ids);
          vm.oneSignalPayload.userId = ids.userId;
          vm.oneSignalPayload.pushToken = ids.pushToken;
          vm.enableOneSignalNotification = true;
        })
        .catch(function(error){
          $ionicLoading.hide();
          $log.error('OneSignalNotificationInitError:',error);
        });
      };

      vm.sendOneSignalNotification = function() {
        OneSignalService.sendNotification(vm.oneSignalPayload)
        .then(function(response){
          $log.info('OneSignalNotification:',response);
          Toast.show('Notification Sent',1000,'center');
        }).catch(function(error){
          $log.error('OneSignalNotification:',error);
        });
      };


      /* Following code is for Ionic Framework Push Notifcation */
      vm.ionicPayload = {
        title:'IonicPlus Notification',
        alert:'This is a test for profile page',
        channels:['all'],
        page:'app.profile',
        urlHash:'#/app/profile'
      };

      function activateIonicPush() {
        if(!IonicService.isRegistered()) {
          $ionicLoading.show({template:'Registering User. Please Wait...'});
          IonicService.identifyUser(Auth.user.email)
          .then(function(user){
            $ionicLoading.hide();
            var message = 'Registered User:' + user.user_id;
            Toast.show(message,2000,'center');
          })
          .catch(function(error){
            $ionicLoading.hide();
            var message = 'Error:' + error;
            Toast.show(message,3000,'center');
          });
        }
      }

      vm.sendIonicNotification = function() {
        Toast.show('Notification Sent',1000,'center');
        IonicService.sendNotification(vm.ionicPayload)
        .then(function(response){
          $log.info('IonicSendNotification:',response);
        }).catch(function(error){
          $log.error('IonicSendNotification:',error);
        });

      };


      function activate() {
        //activateIonicPush();
      }
      vm.pushRegister = function() {
        IonicService.pushRegister();
      };

      activate();

  }

})();

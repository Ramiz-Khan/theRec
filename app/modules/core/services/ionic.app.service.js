(function() {
  'use strict';
  angular.module('core').service('IonicService',IonicService);

  IonicService.$inject = ['$rootScope','$ionicAnalytics','$ionicHistory','$ionicUser','$ionicPush','$log','$http','$base64','$state','Toast','$q','$window','$timeout'];

  function IonicService($rootScope,$ionicAnalytics,$ionicHistory,$ionicUser,$ionicPush,$log,$http,$base64,$state,Toast,$q,$window,$timeout) {
    var _deviceToken;
    var service = {
      init:init,
      sendNotification:sendNotification,
      pushRegister:pushRegister,
      identifyUser:identifyUser,
      isRegistered:isRegistered
    };

    return service;

    function init() {
      $ionicAnalytics.register();
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }

    function identifyUser(username) {
      var deferred = $q.defer();
      var user = $ionicUser.get();
      $log.info('Ionic User: Identifying with Ionic User service:',user);
      if(!user.user_id) {
        //  Set your user_id here, or generate a random one.
        user.user_id = $ionicUser.generateGUID();
      }
        // Add some metadata to your user object.
      angular.extend(user, {
        name: user.user_id, //can set username if this is unique
        bio: 'Ionic App'
      });

        // Identify your user with the Ionic User Service
      $ionicUser.identify(user).then(function(){
        $log.info('Ionic Service:Identify User',user.user_id);
        return pushRegister(user);


      }).then(function(token){
        deferred.resolve(user);
      })
      .catch(function(error){
        deferred.reject(error);
      });

      return deferred.promise;

    }

    function pushRegister(user) {
      $log.info('Ionic Push: Registering user');
      var deferred = $q.defer();

      // Register with the Ionic Push service.  All parameters are optional.
      if($window.cordova) {
        $ionicPush.register({
          canShowAlert: true, //Can pushes show an alert on your screen?
          canSetBadge: true, //Can pushes update app icon badges?
          canPlaySound: true, //Can notifications play a sound?
          canRunActionsOnWake: true, //Can run actions outside the app,
          onNotification: function(notification) {
            // Handle new push notifications here
            $log.info('Ionic Push:Received:',notification);

            if(notification.event === 'message' || notification.page) {
              var message = 'Notification Received:' + JSON.stringify(notification);
              Toast.show(message,10000,'center');
              var data = notification.payload;
              if(data.payload && data.payload.page) {
                $state.go(data.payload.page);
              }
            }
            return true;
          }
        },user).then(function(token){
          _deviceToken = token;
          $log.info('Ionic Push Registration:Token:',_deviceToken,token);
          deferred.resolve(token);
        }).catch(function(error){
          $log.error('Ionic Push Registration:',error);
          deferred.reject(error);
        });
      } else {
        $timeout(function(){
          deferred.reject('Cordova Plugin Not Available');
        });
      }
      return deferred.promise;
    }


    function sendNotification(payload) {
      $log.info('UsingDeviceToken:',_deviceToken);
      var data =  {
        'tokens':[
          _deviceToken
        ],
        'notification':{
          'alert':payload.alert,
          'title':payload.title,
          'ios':{
            'payload':{
              'page':payload.page,
              'urlHash':payload.urlHash
            }
          },
          'android':{
            'payload':{
              'page':payload.page,
              'urlHash':payload.urlHash
            }
          }
        }
      };

      var b64 = $base64.encode(AppConfig.ionicConfig.PRIVATE_KEY).replace('\n', '');

      var headers = {
        'Content-Type': 'application/json',
        'X-Ionic-Application-Id':AppConfig.ionicConfig.APP_ID,
        'Authorization': 'Basic ' + b64
      };

      return $http({
         method : 'POST',
         headers: headers,
         url : AppConfig.ionicConfig.PUSH_URL,
         data : data
      });

    }

    function isRegistered() {
      return _deviceToken?true:false;
    }

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
      $log.info('Ionic Push: Got token ', data.token, data.platform);
      _deviceToken = data.token;
    });



  }

})();

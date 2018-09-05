(function() {
  'use strict';
  angular.module('core').service('OneSignalService',OneSignalService);

  OneSignalService.$inject = ['$q', '$window','$state','$log','$timeout','Toast'];

  function OneSignalService($q,$window,$state,$log,$timeout,Toast) {

    var TAG='OneSignalService';

    var _playerIds = {};


    $window.notificationCallback = function(message) {
      Toast.show(JSON.stringify(message),2000,'center');
      $log.info(TAG,'Received Notification Callback:',JSON.stringify(message));
      $state.go(message.additionalData.page);
      
    };

    function getPlayerIds() {
      var deferred = $q.defer();
      $window.plugins.OneSignal.getIds(function(ids){
        deferred.resolve(ids);
      });
      return deferred.promise;
    }

    function pluginInitialize() {
      var deferred = $q.defer();
      if($window.cordova) {

        if(!$window.plugins.OneSignal){
          $timeout(function() {
            var message = 'OneSignal Plugin is not installed';
            deferred.reject(message);
          },100);

        } else {
          $window.plugins.OneSignal.init(AppConfig.oneSignalConfig.appId,
                                   {googleProjectNumber: AppConfig.fcmConfig.projectNumber},
                                   $window.notificationCallback);
          $timeout(function() {
            var message = 'Initialized OneSignal';
            deferred.resolve(message);
          },100);
        }
      } else {
        $timeout(function() {
          var message = 'Cordova Environment is not available';
          deferred.reject(message);
        },100);
      }
      return deferred.promise;

    }

    function init() {
      $log.info('Initializing OneSignal Service');
      return pluginInitialize()
      .then(function() {
        return getPlayerIds();
      })
      .then(function(ids){
        _playerIds = ids;
        return ids;
      });
    }

    function sendNotification(message) {
      var deferred = $q.defer();
      var notificationObj = {
        app_id: AppConfig.oneSignalConfig.appId,
        contents: {
          en: message.content
        },
        headings: {
          en: message.title
        },
        data: message.data,
        include_player_ids: [_playerIds.userId]
      };

      $window.plugins.OneSignal.postNotification(notificationObj,function(){
        deferred.resolve('Notification Sent');
      },function(err){
        deferred.reject(err);
      });

      return deferred.promise;

    }

    var _service = {
      init:init,
      sendNotification:sendNotification
    };

    return _service;

  }

})();

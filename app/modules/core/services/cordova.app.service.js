(function() {
  'use strict';
  angular.module('core').service('CordovaService',CordovaService);

  CordovaService.$inject = ['$cordovaNetwork','$cordovaSplashscreen','$timeout','$rootScope','$ionicLoading','Toast','$cordovaGoogleAds','$window'];

  function CordovaService($cordovaNetwork,$cordovaSplashscreen,$timeout,$rootScope,$ionicLoading,Toast,$cordovaGoogleAds,$window) {
    var service = {
      init:init
    };

    return service;

    function init() {

       if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if ($window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
      if($window.navigator.splashscreen) {
          if($window.navigator.splashscreen) {
              $timeout(function() {
                $cordovaSplashscreen.hide();
              },300);
          }
      }

      if($window.cordova) {
        var	type = 	$cordovaNetwork.getNetwork();

        if(type === Connection.NONE){
          $ionicLoading.show({
            template:'Offline: Please check your network'
          });
        } else if(type === Connection.CELL_2G ||
                  type === Connection.UNKNOWN ||
                  type === Connection.CELL) {
          Toast.show('Slow Network: Detected ' + type + '. Experience will be sub-optimal',5000,'center');
        }
      }

      if($window.AdMob) {
        $cordovaGoogleAds.createBanner({
          adId:$window.AppConfig.adMobConfig.bannerId,
          position:$window.AdMob.AD_POSITION.BOTTOM_CENTER,
          isTesting:false,
          autoShow:false
        });

        /*$cordovaGoogleAds.prepareInterstitial({
          adId:$window.AppConfig.adMobConfig.interstitialId,
          isTesting:false,
          autoShow:true
        });*/


      }

      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){

        $ionicLoading.show({template:'Offline: Please check your network'});
      });

      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){

        $ionicLoading.hide();
        if(networkState === Connection.CELL_2G ||
           networkState === Connection.UNKNOWN ||
           networkState === Connection.CELL) {
          Toast.show('Network Online:Detected ' + networkState + '. Experience will be sub-optimal ',5000,'center');
        } else {
            Toast.show('Network Online:Detected '+ networkState,2000,'center');
        }

      });

    }
  }

})();

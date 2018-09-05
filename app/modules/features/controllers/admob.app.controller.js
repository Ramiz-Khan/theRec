(function() {
  'use strict';

  angular.module('features').controller('AdMobCtrl', AdMobCtrl);

  AdMobCtrl.$inject = ['$scope','$timeout','$stateParams','$log','Menus','Toast','Auth','$window','$cordovaGoogleAds'];

  function AdMobCtrl($scope, $timeout, $stateParams,$log,Menus,Toast,Auth,$window,$cordovaGoogleAds) {
      var vm = this;
      vm.menus = Menus;


      vm.showAd = function() {
        /*$cordovaGoogleAds.showInterstitial()
        .then(function() {
          $cordovaGoogleAds.prepareInterstitial({
            adId:$window.AppConfig.adMobConfig.interstitialId,
            autoShow:false
          });

        });
        */
        $cordovaGoogleAds.prepareInterstitial({
          adId:$window.AppConfig.adMobConfig.interstitialId,
          autoShow:true
        });

        $cordovaGoogleAds.showBanner($window.AdMob.AD_POSITION.BOTTOM_CENTER);

      };




  }

})();

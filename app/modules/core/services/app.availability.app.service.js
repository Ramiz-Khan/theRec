(function() {
  'use strict';
  angular.module('core').service('AppAvailability',AppAvailability);

  AppAvailability.$inject = ['$cordovaAppAvailability','$q','$window'];

  function AppAvailability($cordovaAppAvailability,$q,$window){
    var schemes = {
      'facebook':['fb://','com.facebook.katana'],
      'twitter':['twitter://','com.twitter.android']

    };

    this.isAppAvailable = function(provider) {
      var deferred = $q.defer();

      var scheme = schemes[provider][0];
      if($window.ionic.Platform.isAndroid()) {
         scheme = schemes[provider][1];
      }
      $cordovaAppAvailability.check(scheme,
          function() {
            deferred.resolve('true');
          },
          function() {

            deferred.reject('false');
          }
      );

      return deferred.promise;
    };

  }

})();

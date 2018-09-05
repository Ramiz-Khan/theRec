(function() {
  'use strict';
  angular.module('users').factory('Auth',Auth);

  Auth.$inject = ['$log','FireAuth'];

  function Auth($log,FireAuth) {
    $log.info('Assigning Auth');
    var auth = FireAuth;
    return auth;

  }

})();

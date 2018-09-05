(function() {
  'use strict';
  angular.module('core').service('CoreService',CoreService);

  CoreService.$inject = ['IonicService','CordovaService'];

  function CoreService(IonicService,CordovaService) {
    var service = {
      init:init
    };

    return service;

    function init() {

      IonicService.init();
      CordovaService.init();
    
    }
  }

})();

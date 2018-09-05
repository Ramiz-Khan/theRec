(function() {
  'use strict';
  angular.module('features').directive('disableTap',disableTap);

  disableTap.$inject = ['$timeout'];

  function disableTap($timeout) {
    return {
      link: function() {
        $timeout(function() {
          var container = document.getElementsByClassName('pac-container');
          // disable ionic data tab
          angular.element(container).attr('data-tap-disabled', 'true');
          // leave input field if google-address-entry is selected
          angular.element(container).on('click', function(){
              document.getElementById('geocomplete').blur();
          });

        },5000);

      }
    };
  }

})();

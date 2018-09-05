'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(AppConfig.appName, AppConfig.vendorDependencies);




// Setting HTML5 Location Mode

angular.module(AppConfig.appName).config(['$locationProvider','$compileProvider',
	function($locationProvider,$compileProvider) {
		//$locationProvider.hashPrefix('!');
		// $locationProvider.html5Mode(true);

	}
])
.config(['$ionicAppProvider', function($ionicAppProvider) {
	$ionicAppProvider.identify({
      app_id: AppConfig.ionicConfig.APP_ID,
			api_key:AppConfig.ionicConfig.API_KEY,
			gcm_key:AppConfig.ionicConfig.GCM_KEY,
			gcm_id:AppConfig.ionicConfig.GCM_ID,
			dev_push:AppConfig.ionicConfig.DEV_PUSH
 	});
}]);



angular.module(AppConfig.appName)
.run(function($ionicPlatform,CoreService) {
	$ionicPlatform.ready(function() {
		CoreService.init();

	});

	// add possible global event handlers here

})

/*.factory('httpInterceptor', function ($rootScope, $q, localStorageService,ENV) {
    return {
      // Add authorization token to headers
      request: function (config) {
				config.url = ENV.apiEndpoint + config.url;
        config.headers = config.headers || {};
        if (localStorageService.get('token')) {
          config.headers.Authorization =  localStorageService.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
					// remove any stale tokens
					localStorageService.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })*/
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  //$httpProvider.defaults.useXDomain = true;
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];

  //$httpProvider.interceptors.push('httpInterceptor');
})
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix(AppConfig.appName);

})
.config(function ($ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.scrolling.jsScrolling(true);
 	
});





var AppInit = function() {

    var onDeviceReady = function() {
        receivedEvent('deviceready');


    };

    var receivedEvent = function(event) {
        console.debug('Start event received, bootstrapping application setup.');
        //var body = document.getElementsByTagName("body")[0];

        angular.bootstrap(document, [AppConfig.appName]);
    };

    this.bindEvents = function() {
        document.addEventListener('deviceready', onDeviceReady, false);
    };

    //If cordova is present, wait for it to initialize, otherwise just try to
    //bootstrap the application.
    if (window.cordova !== undefined) {
        console.debug('Cordova found, waiting for device.');
        this.bindEvents();

    } else {
        console.debug('Cordova not found, booting application');
        receivedEvent('manual');
    }
};

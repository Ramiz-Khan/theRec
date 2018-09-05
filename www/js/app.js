'use strict';

angular.module('env', [])
.constant('ENV', {name:'development',apiEndpoint:'http://localhost:3000'});

'use strict';
// Init the application configuration module for AngularJS application
var AppConfig = (function() {
	// Init module configuration options
	var appName = 'ionicplus';
	//var firebaseRef =  new Firebase('https://ionicplus.firebaseio.com');
	var firebaseConfig = {
    apiKey: 'AIzaSyBpcEKCBiE4v1G4lD1bG7vvhEI46Lh8V-s',
    authDomain: 'ionicplus.firebaseapp.com',
    databaseURL: 'https://ionicplus.firebaseio.com',
    storageBucket: 'project-9079142280948291611.appspot.com',
  };

	var oneSignalConfig = {
		appId:'5b1cb5c6-4b40-40c5-9e1e-da1633a16b5b'
	};

	var fcmConfig = {
		projectNumber: '539302718814' // aka sender id of google cloud messaging
	};

	var ionicConfig = {
		APP_ID:'09341bb2',
		API_KEY:'367277d684400a043de82b43136df08ee3062dd4d41ae72b',
		PRIVATE_KEY:'',
		GCM_KEY:'',
		GCM_ID:'',
		PUSH_URL:'https://push.ionic.io/api/v1/push',
		DEV_PUSH:false


	};

	var adMobConfig = {
		interstitialId:'ca-app-pub-4509591621518500/2777536475',
		bannerId:'ca-app-pub-4509591621518500/9543923678'
	};

	var facebookConfig = {
		appId:'769794906500234',
		appScope:['email']
	};

	var googleConfig = {
		appId:'387809114393-pt8d9aoi0erqeamvdskjboefjj353f3s.apps.googleusercontent.com',
		appScope: ['https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email']
	};

	var twitterConfig = {
		appId:'ZNC6C82cdgyBMZKRdbGzE6kbX',
		appSecret:'PTQJsFnLcGkmhxWCpeSYbC4csq0R85JDRhCC7Rgin7AH2fx3fT'
	};

	var vendorDependencies = ['ionic', 'ngCordova','ngResource', 'ngAnimate', 'ngSanitize', 'ui.router', 'env','LocalStorageModule','firebase','ngMap','ionic.service.core','ionic.service.analytics','ionic.service.push','base64','ngCordovaOauth'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(appName).requires.push(moduleName);
	};

	return {
		appName: appName,
		firebaseConfig:firebaseConfig,
		facebookConfig:facebookConfig,
		googleConfig:googleConfig,
		twitterConfig:twitterConfig,
		oneSignalConfig:oneSignalConfig,
		fcmConfig:fcmConfig,
		ionicConfig:ionicConfig,
		adMobConfig:adMobConfig,
		vendorDependencies: vendorDependencies,
		registerModule: registerModule
	};
})();

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
.run(["$ionicPlatform", "CoreService", function($ionicPlatform,CoreService) {
	$ionicPlatform.ready(function() {
		CoreService.init();

	});

	// add possible global event handlers here

}])

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
.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  //$httpProvider.defaults.useXDomain = true;
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];

  //$httpProvider.interceptors.push('httpInterceptor');
}])
.config(["localStorageServiceProvider", function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix(AppConfig.appName);

}])
.config(["$ionicConfigProvider", function ($ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.scrolling.jsScrolling(true);
 	
}]);





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

'use strict';

// Use Applicaion Config module to register a new module
AppConfig.registerModule('core');

'use strict';

// Use Applicaion Config module to register a new module
AppConfig.registerModule('features');

'use strict';

// Use Applicaion Config module to register a new module
AppConfig.registerModule('users',[AppConfig.appName]);

'use strict';

angular.module('core')
.config(function() {

});

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/app/login');

		// Home state routing
		$stateProvider
		.state('app', {
		  abstract: true,
			url: '/app',
			templateProvider: ["$templateCache", function($templateCache){
        return $templateCache.get('modules/core/views/header.app.view.html');
      }],
			controller:'HeaderCtrl as headerCtrl'

		})
	 	.state('app.features', {
			url: '/features',
			views: {
				'menuContent': {
					templateProvider: ["$templateCache", function($templateCache){
						return $templateCache.get('modules/core/views/features.app.view.html');
					}],
					controller:'FeaturesCtrl as featuresCtrl'

				}

			}

		});

	}
]);

(function() {
  'use strict';

  angular.module('core').controller('FeaturesCtrl', FeaturesCtrl);

  FeaturesCtrl.$inject = ['$scope','$timeout','$stateParams','Menus'];

  function FeaturesCtrl($scope, $timeout, $stateParams, Menus) {
      var vm = this;
      vm.menus = Menus;
      activate();

      function activate() {
        vm.features = [
          {name:'Profile',link:'app.profile'},
          {name:'Feeds',link:'app.feeds'},
          {name:'Friends',link:'app.friends'},
          {name:'Gallery',link:'app.gallery'},
          {name:'Maps',link:'app.maps'},
          {name:'Notification',link:'app.notifications'},
          {name:'AdMob',link:'app.admob'},
          {name:'Camera',link:'app.camera'}

        ];

      }

  }

})();

(function() {
  'use strict';

  angular.module('core').controller('HeaderCtrl', HeaderCtrl);

  HeaderCtrl.$inject = ['$scope','$rootScope','$state','$ionicHistory','Menus','Auth'];

  function HeaderCtrl($scope,$rootScope,$state,$ionicHistory,Menus,Auth) {
    var vm = this;
    vm.menus = Menus;
    vm.isLoggedIn = Auth.isLoggedIn;
    activate();

    function activate() {

    }

    vm.signout = function() {
      Auth.signOut();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
          historyRoot:true,
          disableBack:true
      });
      if(!Auth.isLoggedIn()) {
        $state.go('app.login');
      }

    };

    $rootScope.$on('auth:signout',function(){
      $state.go('app.login');
    });
  }

})();

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

(function() {
  'use strict';
  angular.module('core').factory('CameraService',CameraService);

  CameraService.$inject = ['$cordovaCamera','$q','$window'];

  function CameraService($cordovaCamera,$q,$window){
    var options = {
     allowEdit: false,
     destinationType: Camera.DestinationType.DATA_URL,
     encodingType: Camera.EncodingType.JPEG,
     targetWidth: 300,
     targetHeight: 300,
     saveToPhotoAlbum: true,
     popoverOptions: CameraPopoverOptions,
   };

    var service = {
      getPicture:getPicture

    };

    return service;

    function getType(type){
      return (type === 0)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY;
    }

    function getPicture(type) {
      var deferred = $q.defer();
      options.sourceType = getType(type);
      $cordovaCamera.getPicture(options).then(function(imageData) {
        deferred.resolve(imageData);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

  }

})();

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

(function() {
  'use strict';
  angular.module('core').service('Menus',Menus);

  Menus.$inject = ['$rootScope'];

  function Menus($rootScope){

    $rootScope.header = {};
  


  }



})();

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

(function() {
  'use strict';
  angular.module('core').factory('Toast', Toast);

  Toast.$inject = ['$rootScope','$timeout','$ionicPopup','$ionicLoading','$cordovaToast'];

  function Toast($rootScope, $timeout, $ionicPopup,$ionicLoading, $cordovaToast) {

    var service = {
      show:show
    };
    return service;

	  function show(message,duration,position) {

	    message = message || 'There was an error..';
	    duration = duration || 2000;
	    position = position || 'top';


	  	//$cordovaToast.show(message, duration, position);
      $ionicLoading.show({
          template: message,
          duration:duration
      });
	    
		}
	}


})();

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

(function() {
  'use strict';

  angular.module('features').controller('CameraCtrl', CameraCtrl);

  CameraCtrl.$inject = ['$scope','$timeout','$stateParams','$log','Menus','Toast','Auth','$window','CameraService','$sce'];

  function CameraCtrl($scope, $timeout, $stateParams,$log,Menus,Toast,Auth,$window,CameraService,$sce) {
      var vm = this;
      vm.menus = Menus;
      vm.photos=[];

      vm.getMedia = function(type) {
        CameraService.getPicture(type).then(function(imageData) {
          var data =  'data:image/jpeg;base64,' + imageData;
          vm.photos.push(data);

        }, function(err) {
          $log.error(err);
          Toast.show('Error in Selecting Picture:',err);

        });

      };






  }

})();

(function() {
  'use strict';

  angular.module('features').controller('MapsCtrl', MapsCtrl);

  MapsCtrl.$inject = ['$scope','$timeout','$stateParams','$log','Menus','Locations'];

  function MapsCtrl($scope, $timeout, $stateParams, $log,Menus,Locations) {
      var vm = this;
      vm.menus = Menus;
      vm.maps = {markers:[]};
      vm.showAutoPlaces = true;


      activate();

      function activate() {
        vm.locationData = Locations.getLocations();

      }

      function initLocation() {
        vm.locationData.then(function(locationData) {
          var coords = locationData.currentLocation.latlng;
          var latlng = new google.maps.LatLng(coords[0],coords[1]);

          _.each(locationData.places,function(place){
            var marker = new google.maps.Marker({
              position: latlng,
              map: vm.maps.map,
              icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
              animation: google.maps.Animation.DROP

            });
            vm.maps.markers.push(marker);

          });

          vm.maps.map.setCenter(latlng);
          vm.maps.map.setZoom(15);
        });
      }



      function clearMarkers() {
        if(vm.maps.map){
          _.each(vm.maps.markers,function(marker){
            marker.setMap(null);
          });
          vm.maps.markers = [];
        }
      }
      function addMarker(place) {
        var marker = new google.maps.Marker({
          map: vm.maps.map,
          position: place.geometry.location,
          icon: {
            url: 'http://maps.gstatic.com/mapfiles/circle.png',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(10, 17)
          }
        });
        vm.maps.markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
          vm.maps.service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.error(status);
              return;
            }
            vm.maps.infoWindow.setContent(result.name);
            vm.maps.infoWindow.open(vm.maps.map, marker);
          });
        });
      }

      function getNearbyPlaces(options) {
        //get the last marker
        var types = options || ['restaurant','cafe'];

        var request = {
          bounds: vm.maps.map.getBounds(),
          types:types
        };
        vm.maps.service.radarSearch(request, function(results,status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
          }
          vm.maps.markers = [];
          for (var i = 0, result; result = results[i]; i++) {
            addMarker(result);
          }

        });




      }

      vm.showNearbyPlaces = function(type) {
        var gTypes=[];
        if(type === 'food') {
          gTypes = ['restaurant','cafe'];
        } else if (type === 'shops') {
          gTypes = ['store','food'];
        }
        clearMarkers();
        getNearbyPlaces(gTypes);

      };

      vm.tabSelected = function(selection) {
        if(!vm.maps.map) {
          return;
        }
        if(selection === 'auto') {
          clearMarkers();
          initLocation();
          vm.showAutoPlaces = true;

        } else {
          clearMarkers();
          getNearbyPlaces();
          vm.showAutoPlaces = false;
        }
      };

      $scope.placeChanged = function() {
        //Adddress within the map
        var place = this.getPlace();


        var latlng = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());

        vm.geoname = place.name;
        vm.maps.map.setCenter(latlng);
        vm.maps.map.setZoom(15);
        var marker = new google.maps.Marker({
          position: latlng,
          map: vm.maps.map,
          icon:'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'

        });
        vm.maps.markers = [marker];


      };



      $scope.$on('mapInitialized', function(event, map) {
        $log.info('Map Initialized');
        vm.maps.map = map;
        vm.maps.service = new google.maps.places.PlacesService(map);
        vm.maps.infoWindow = new google.maps.InfoWindow();
        initLocation();

      });




  }

})();

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

'use strict';

// Setting up route
angular.module('features').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('app.notifications', {
			url: '/notifications',
			views: {
				'menuContent': {
					templateProvider: ["$templateCache", function($templateCache){
						return $templateCache.get('modules/features/views/notifications.app.view.html');
					}],
					controller:'NotificationsCtrl as notificationsCtrl'

				}

			}

		})
		.state('app.admob', {
			url: '/admob',
			views: {
				'menuContent': {
					templateProvider: ["$templateCache", function($templateCache){
						return $templateCache.get('modules/features/views/admob.app.view.html');
					}],
					controller:'AdMobCtrl as adMobCtrl'

				}

			}

		})
		.state('app.maps', {
			url: '/maps',
			views: {
				'menuContent': {
					templateProvider: ["$templateCache", function($templateCache){
						return $templateCache.get('modules/features/views/maps.app.view.html');
					}],
					controller:'MapsCtrl as mapsCtrl'

				}

			}

		})
		.state('app.camera', {
			url: '/camera',
			views: {
				'menuContent': {
					templateProvider: ["$templateCache", function($templateCache){
						return $templateCache.get('modules/features/views/camera.app.view.html');
					}],
					controller:'CameraCtrl as cameraCtrl'

				}

			}

		});




	}
]);

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

(function() {
  'use strict';
  angular.module('features').factory('Locations',Locations);
  Locations.$inject = ['$http','$q','$timeout','$cordovaGeolocation'];


  function Locations($http,$q,$timeout,$cordovaGeolocation) {
    var locations = {
      currentLocation: {
        latlng:['12.9667','77.5667']
      },
      nearbyPlaces:[{
        latlng:['12.9667','77.5667']
      }]

    };

    var service = {
      getLocations:getLocations

    };

    return service;


    function getLocations() {
      var deferred = $q.defer();
      $timeout(function(){
        if(window.cordova) {
          var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            locations.currentLocation.latlng = [lat,long];
            locations.places = [{latlng:[lat,long]}];
            deferred.resolve(locations);
          }, function(err) {
            deferred.resolve(locations);
          });
        } else if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var long  = position.coords.longitude;
            locations.currentLocation.latlng = [lat,long];
            locations.places = [{latlng:[lat,long]}];
            deferred.resolve(locations);
          },function(error){
            deferred.resolve(locations);
          });

        } else {
          deferred.resolve(locations);
        }

      });

      return deferred.promise;


    }



  }

})();

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateProvider: ["$templateCache", function($templateCache){
                 return $templateCache.get('modules/users/views/login.app.view.html');
                }],
                controller: 'LoginCtrl as loginCtrl'
            }
        }

    })
    .state('app.password', {
        url: '/password',
        views: {
            'menuContent': {
                templateProvider: ["$templateCache", function($templateCache){
                 return $templateCache.get('modules/users/views/password.app.view.html');
                }],
                controller: 'PasswordCtrl as passwordCtrl'
            }
        }

    })
    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateProvider: ["$templateCache", function($templateCache){
                 return $templateCache.get('modules/users/views/profile.app.view.html');
                }],
                controller: 'ProfileCtrl as profileCtrl'

            }
        }

    })
    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateProvider: ["$templateCache", function($templateCache){
                 return $templateCache.get('modules/users/views/friends.app.view.html');
                }],
                controller: 'FriendsCtrl as friendsCtrl'

            }


        }
    })
    .state('app.feeds', {
        url: '/feeds',
        views: {
            'menuContent': {
                templateProvider: ["$templateCache", function($templateCache){
                 return $templateCache.get('modules/users/views/feeds.app.view.html');
                }],
                controller: 'FeedsCtrl as feedsCtrl'

            }
        }

    })
    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateProvider: ["$templateCache", function($templateCache){
                 return $templateCache.get('modules/users/views/gallery.app.view.html');
                }],
                controller: 'GalleryCtrl as galleryCtrl'

            }
        }
    });
  }
]);

(function() {
  'use strict';
  angular.module('users').controller('FeedsCtrl',FeedsCtrl);

  FeedsCtrl.$inject = ['$scope','$stateParams','$timeout','Menus','$ionicHistory','UserGraph'];

  function FeedsCtrl($scope, $stateParams, $timeout,Menus,$ionicHistory,UserGraph) {

    var vm = this;

    vm.menus = Menus;

    activate();
    function activate() {
      UserGraph.getFeeds().then(function(feeds) {
        vm.feeds = feeds;
      });


    }


 }


})();

(function() {
  'use strict';
  angular.module('users').controller('FriendsCtrl',FriendsCtrl);

  FriendsCtrl.$inject = ['$scope','$stateParams','$timeout','Menus','UserGraph'];

  function FriendsCtrl($scope, $stateParams, $timeout,Menus,UserGraph) {

    var vm = this;
    vm.menus = Menus;

    activate();
    function activate() {
      UserGraph.getFriends().then(function(friends){
        vm.friends = friends;
      });


    }


 }


})();

(function() {
  'use strict';
  angular.module('users').controller('GalleryCtrl',GalleryCtrl);

  GalleryCtrl.$inject = ['$scope','$stateParams','$timeout','$q','Menus','UserGraph','$ionicScrollDelegate','$ionicLoading'];

  function GalleryCtrl($scope, $stateParams, $timeout,$q,Menus,UserGraph,$ionicScrollDelegate,$ionicLoading) {

    var vm = this;
    vm.menus = Menus;
    vm.imgCache = {};
    activate();
    function activate() {
      UserGraph.getPhotos().then(function(photos){

        var imageLoaders = [];

        _.each(photos,function(photo){
          (function(photo) {

            var promise = $q(function(resolve,reject) {
              var img = new Image();

              img.onload = function(){
                photo.height = img.height;
                photo.width = img.width;
                resolve(img);

              };
              img.src = photo.location;

            });
            imageLoaders.push(promise);


          })(photo);
      });
      $q.all(imageLoaders)
      .then(function(data) {
        vm.photos = photos;
      });




    });




  }//activate



} //GalleryCtrl


})();

(function() {
  'use strict';

  angular.module('users').controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope','$rootScope','$timeout','$state','$stateParams','Menus','$log','$ionicModal','$templateCache','Auth','$ionicLoading','Toast','$ionicHistory','$cordovaSplashscreen'];

  function LoginCtrl($scope,$rootScope, $timeout,$state, $stateParams, Menus,$log, $ionicModal,$templateCache,Auth,$ionicLoading,Toast,$ionicHistory,$cordovaSplashscreen) {
      var TAG = 'LoginCtrl:';
      var vm = this;
      vm.menus = Menus;

      activate();

      function activate() {
        $log.debug(TAG,'activate');
        if(navigator.splashscreen) {
            $timeout(function() {
              $cordovaSplashscreen.hide();
            },300);
        }

        var signinTemplate = $templateCache.get('modules/users/views/signin.modal.app.view.html');
        vm.signinModal = $ionicModal.fromTemplate(signinTemplate, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        var signupTemplate = $templateCache.get('modules/users/views/signup.modal.app.view.html');
        vm.signupModal = $ionicModal.fromTemplate(signupTemplate, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        var recoverTemplate = $templateCache.get('modules/users/views/recover.modal.app.view.html');
        vm.recoverModal = $ionicModal.fromTemplate(recoverTemplate, {
          scope: $scope,
          animation: 'slide-in-up'
        });

        if(Auth.isLoggedIn()) {
          $ionicHistory.nextViewOptions({
            historyRoot:true,
            disableBack:true
          });
          $timeout(function() {

            $state.go('app.profile');
          },300);
        }

      }


      vm.login = function() {
        vm.signinModal.show();
      };

      vm.recover = function() {
        vm.recoverModal.show();
      };

      vm.signIn = function(credentials) {
        if (credentials && credentials.email && credentials.password) {
            $ionicLoading.show({
                template: 'Signing In...'
            });
            Auth.signIn(credentials)
            .then(function (user) {
                $log.debug('Logged in as:'+ user);
                $ionicLoading.hide();
                Toast.show('Logged In');
                vm.signinModal.hide();
                $ionicHistory.nextViewOptions({
                  historyRoot:true,
                  disableBack:true
                });
                $state.go('app.profile');
            }).catch(function (error) {
                $log.debug(error);
                $ionicLoading.hide();
                Toast.show(error);
            });
        } else {
            Toast.show('Please enter credentials');

        }


      };


      vm.oauthSignin = function(provider) {
        Auth.oauthSignIn(provider).then(function(user) {
          $log.debug('Logged in as:' , user);

          $ionicHistory.nextViewOptions({
            historyRoot:true,
            disableBack:true
          });

          $state.go('app.profile');
        }).catch(function(error) {
          $log.debug(error);
          Toast.show(error);
          $log.debug('Authentication failed:', error);
        });

      };

      vm.signUp = function() {
        vm.signupModal.show();
      };

      vm.closeSignupModal = function() {
        vm.signupModal.hide();
      };

      vm.closeLoginModal = function() {
        vm.signinModal.hide();
      };

      vm.closeRecoverModal = function() {
        vm.recoverModal.hide();
      };



      vm.createUser = function(credentials) {
         $log.debug('Create credentials Function called');
         if (credentials && credentials.username && credentials.email && credentials.password) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            Auth.createUser(credentials)
            .then(function (user) {
                $log.debug('Created User as:', user);
                $ionicLoading.hide();
                Toast.show('Logged In');
                vm.signupModal.hide();
                $ionicHistory.nextViewOptions({
                  historyRoot:true,
                  disableBack:true
                });
                $state.go('app.profile');
            }).catch(function (error) {
                //alert("Error: " + error);
                $log.debug(error);
                Toast.show('Signup Error:' + error);
                $ionicLoading.hide();
            });
          } else {
            Toast.show('Please Enter Credentials');
          }
      };

      vm.forgot = function(credentials){
        Auth.forgot(credentials).then(function() {
          $log.debug('Password Reset Email sent');
          Toast.show('Reset Password Email Sent',2000,'center');
          vm.signinModal.hide();

        }).catch(function(error){
          $log.debug('Error in reseting password',error);
          Toast.show(error);
        });
      };

      vm.signout = function() {
        Auth.signOut().then(function() {
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({
            historyRoot:true,
            disableBack:true
          });
          $state.go('app.login');
        })
        .catch(function(error) {
          Toast.show('Logout Error:' + error);
        });

      };

      vm.skip = function() {
        $rootScope.isAppPreview = true;
        Auth.user.displayName='Guest';
        Auth.user.email='guest@ionicplus.com';
        $state.go('app.profile');
      };


      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        vm.signinModal.remove();
        vm.signupModal.remove();
        vm.recoverModal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

  }

})();

(function() {
  'use strict';
  angular.module('users').controller('PasswordCtrl', PasswordCtrl);

  PasswordCtrl.$inject = ['$rootScope','$scope','$stateParams','$timeout','Menus','Auth','Toast','$ionicLoading'];

  function PasswordCtrl($rootScope,$scope, $stateParams, $timeout,Menus,Auth,Toast,$ionicLoading) {
    // Set Header
    var vm = this;
    vm.menus = Menus;
    vm.user = Auth.user;

    activate();

    function activate() {

    }

    vm.changePassword = function(credentials) {
      if (credentials.newPassword === credentials.confirmNewPassword) {
        credentials.email = vm.user.email;
        $ionicLoading.show({
            template: 'Please wait...'
        });
        Auth.changePassword(credentials)
        .then(function(response){
          $ionicLoading.hide();
          Toast.show('Password Changed Successfully',1000);
        })
        .catch(function(error) {
          Toast.show(error);
        });
      } else {
        Toast.show('New Passwords do not match',1000);
      }
    };


  }

})();

(function() {
  'use strict';
  angular.module('users').controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$rootScope','$scope','$stateParams','$timeout','Menus','Auth','UserGraph'];

  function ProfileCtrl($rootScope,$scope, $stateParams, $timeout,Menus,Auth,UserGraph) {
    // Set Header
    var vm = this;
    vm.menus = Menus;
    vm.user = Auth.user;

    activate();

    function activate() {
      UserGraph.getFollowing().then(function(following) {
        vm.following = following;
      });

      UserGraph.getProfile().then(function(profile) {
        vm.profile = profile;
      });


    }


  }

})();

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

 (function() {
   'use strict';
   angular.module('users').factory('FireAuth',FireAuth);
   FireAuth.$inject = ['$firebaseAuth','$window','$rootScope','$q','$log','$cordovaFacebook','Toast','$cordovaOauth'];
   function FireAuth($firebaseAuth,$window,$rootScope,$q,$log,$cordovaFacebook,Toast,$cordovaOauth) {

    var user = {
      displayName:'',
      email:''
    };

    var _nativeProviderHandler = {
      facebook:nativeFacebookLogin
    };

    firebase.initializeApp(AppConfig.firebaseConfig);
    var _fAuth =  $firebaseAuth();

    var _providerObjs = {};
    _providerObjs.twitter =  firebase.auth.TwitterAuthProvider;
    _providerObjs.facebook = firebase.auth.FacebookAuthProvider;
    _providerObjs.google =  firebase.auth.GoogleAuthProvider;



    _fAuth.$onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {
      } else {
        $rootScope.$broadcast('auth:signout');
      }
    });

    var service = {
      createUser:createUser,
      signIn:signIn,
      oauthSignIn:oauthSignIn,
      signOut:signOut,
      forgot:forgot,
      user:user,
      isLoggedIn:isLoggedIn,
      changePassword:changePassword

    };
    return service;

    function createUser(credentials) {
      var deferred = $q.defer();
      _fAuth.$createUserWithEmailAndPassword(credentials.email,credentials.password)
      .then(function(authData) {
        Toast.show('Loading...',2000,'center');
        return authData.updateProfile({displayName:credentials.username});
      })
      .then(function() {
        return _fAuth.$signInWithEmailAndPassword(credentials.email,credentials.password);
      })
      .then(function(authData){
        if(authData) {
          user.displayName = authData.displayName || authData.email;
          user.email = authData.email;
        }
        deferred.resolve(user);

      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function getFacebookAuthData(res) {
          //Need to convert expiresIn format from FB to date
        var expiration_date = new Date();
          expiration_date.setSeconds(expiration_date.getSeconds() + res.authResponse.expiresIn);
          expiration_date = expiration_date.toISOString();

        var facebookAuthData = {
            'id': res.authResponse.userID,
            'access_token': res.authResponse.accessToken,
            'expiration_date': expiration_date
        };
        return facebookAuthData;
    }


    function nativeFacebookLogin(deferred) {
      $cordovaFacebook.login(['public_profile', 'email'])
      .then(function(res) {
          var facebookAuthData = getFacebookAuthData(res);
          Toast.show('Loading...',2000,'center');
          var providerObj = _providerObjs['facebook'];
          var credential = providerObj.credential(facebookAuthData.access_token);
          return _fAuth.$signInWithCredential(credential);
      })
      .then(function(authData){
          Toast.show('Logged In',2000,'center');
          $log.debug('Firebase Facebook Login ',authData);

          var userObj = authData;
          if(authData.providerData[0]){
            userObj = authData.providerData[0];
          }
          user.displayName = userObj.displayName || userObj.email;
          user.email = userObj.email;
          deferred.resolve(user);

      }).catch(function(error) {
          deferred.reject(error);
      });

    }

    function signInWithNgCordovaOauth(provider){
      var config = {};
      var providerObj = _providerObjs[provider];
      if(provider === 'facebook') {
        config = AppConfig.facebookConfig;
        return $cordovaOauth.facebook(config.appId,config.appScope)
                .then(function(result){
                  console.log('NgCordovaOauth:',result);
                  //map to authData
                  var credentialObj = providerObj.credential(result.access_token);
                  return credentialObj;
                });
      } else if (provider === 'google') {
        config = AppConfig.googleConfig;
        return $cordovaOauth.google(config.appId,config.appScope)
                .then(function(result){
                  console.log('NgCordovaOauth:',result);
                  var credentialObj = providerObj.credential(null,result.access_token);
                  return credentialObj;
                });
      } else if (provider === 'twitter'){
        config = AppConfig.twitterConfig;
        return $cordovaOauth.twitter(config.appId,config.appSecret)
                .then(function(result){
                  console.log('NgCordovaOauth:',result);
                  var credentialObj = providerObj.credential(result.oauth_token,result.oauth_token_secret);
                  return credentialObj;
                });
      }
    }

    function oauthBrowserSignIn(provider) {
      var deferred = $q.defer();
      if($window.cordova){
        //hack as firebase 3.x is not supporting social auth in mobile env
        signInWithNgCordovaOauth(provider)
        .then(function(credential){
          return _fAuth.$signInWithCredential(credential);
        })
        .then(function(authData){
          Toast.show('Logged In',2000,'center');
          console.log('OauthSignIn:',authData);
          //var userObj = authData.user.providerData[0];
          var userObj = authData;
          if(authData.providerData[0]){
            userObj = authData.providerData[0];
          }
          user.displayName = userObj.displayName || userObj.email;
          user.email = userObj.email;
          deferred.resolve(user);
        })
        .catch(function(error){
          deferred.reject(error);
        });

      } else {
        _fAuth.$signInWithPopup(provider)
        .then(function(authData) {
          Toast.show('Logged In',2000,'center');
          console.log('OauthSignIn:',authData);
          var userObj = authData;
          if(authData.user && authData.user.providerData[0]){
            userObj = authData.user.providerData[0];
          }
          user.displayName = userObj.displayName || userObj.email;
          user.email = userObj.email;
          deferred.resolve(user);

        }).catch(function(error) {
          deferred.reject(error);
        });
      }

      return deferred.promise;
    }

    function oauthNativeSignIn(provider) {

      var deferred = $q.defer();

       var providerHandler = _nativeProviderHandler[provider];
       if(providerHandler) {
         providerHandler(deferred);
       } else {
         oauthBrowserSignIn(provider)
         .then(function(user){
           deferred.resolve(user);
         })
         .catch(function(error){
           deferred.reject(error);
         });

       }

      return deferred.promise;

    }

    function oauthSignIn(provider) {
       //AppAvailability.isAppAvailable(provider);
       if($window.cordova && $window.facebookConnectPlugin) {
         return oauthNativeSignIn(provider);
       } else {
         return oauthBrowserSignIn(provider);
       }
     }


    function signIn(credentials) {
      var deferred = $q.defer();
      _fAuth.$signInWithEmailAndPassword(credentials.email,credentials.password)
      .then(function(authData) {
        console.log('SignIn:',authData);
        Toast.show('Logged In',2000,'center');
        user.displayName = authData.displayName || authData.email;
        user.email = authData.email;
        deferred.resolve(user);

      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function forgot(credentials) {
      var deferred = $q.defer();

      _fAuth.$sendPasswordResetEmail(credentials.email)
      .then(function() {
        $log.debug('Password reset email sent successfully!');
        deferred.resolve('Password reset email sent successfully!');
      })
      .catch(function(error) {
        deferred.reject(error);
      });


      return deferred.promise;
    }

    function isLoggedIn(){

      var currentUser = _fAuth.$getAuth();
      var isUser = currentUser?true:false;
      if(isUser) {
        var userObj = currentUser;
        if(currentUser.providerData[0]) {
          userObj = currentUser.providerData[0];
        }
        user.displayName = userObj.displayName || userObj.email;
        user.email = userObj.email;
      }

      return isUser;


    }

    function signOut() {
      return _fAuth.$signOut();
    }

    function changePassword(credentials) {
      var deferred = $q.defer();
      _fAuth.$updatePassword(credentials.newPassword)
      .then(function() {
        $log.debug('Password changed successfully!');
        deferred.resolve('Password changed successfully');
      }).catch(function(error) {
        console.error('Error: ', error);
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }

})();

(function() {
  'use strict';
  angular.module('users').factory('UserGraph',UserGraph);
  UserGraph.$inject = ['$http','$q','$timeout'];

  function UserGraph($http,$q,$timeout) {
    var service = {
      getFollowing:getFollowing,
      getFriends:getFriends,
      getFeeds:getFeeds,
      getPhotos:getPhotos,
      getProfile: getProfile
    };

    return service;

    function getFollowing() {
      var deferred = $q.defer();
      $timeout(function(){
        var following = [
          {name:'Ionic',status:'Hybrid Mobile Framework',location:'img/ionic-logo-blog.png'},
          {name:'AngularJS',status:'Going for 2.0',location:'img/Angularjs.jpg'},
          {name:'Android',status:'Looking forward for Marshmallow',location:'img/android.jpg'},
          {name:'IOS',status:'Going for 9',location:'img/ios.png'},
          {name:'Ionic',status:'Hybrid Mobile Framework',location:'img/ionic-logo-blog.png'},
          {name:'AngularJS',status:'Going for 2.0',location:'img/Angularjs.jpg'},
          {name:'Android',status:'Looking forward for Marshmallow',location:'img/android.jpg'},
          {name:'IOS',status:'Going for 9',location:'img/ios.png'}


        ];
        deferred.resolve(following);
      });


      return deferred.promise;

    }

    function getFriends(){
      var deferred = $q.defer();
      $timeout(function(){
        var following = [
          {name:'Ionic',status:'Hybrid Mobile Framework',location:'img/ionic-logo-blog.png'},
          {name:'AngularJS',status:'Going for 2.0',location:'img/Angularjs.jpg'},
          {name:'Android',status:'Looking forward for Marshmallow',location:'img/android.jpg'},
          {name:'IOS',status:'Going for 9',location:'img/ios.png'}
        ];
        deferred.resolve(following);
      });


      return deferred.promise;

    }

    function getFeeds(){
      var deferred = $q.defer();
      $timeout(function(){
        var following = [
          {name:'Ionic',status:'Hybrid Mobile Framework',location:'img/ionic-logo-blog.png',likes:10,comments:20,time:'Just Now'},
          {name:'AngularJS',status:'Going for 2.0',location:'img/Angularjs.jpg',likes:10,comments:20,time:'1 hour ago'},
          {name:'Android',status:'Looking forward for Marshmallow',location:'img/android.jpg',likes:30,comments:45,time:'2 hours ago'},
          {name:'IOS',status:'Going for 9',location:'img/ios.png',likes:40, comments:50,time:'1 hour ago'}

        ];
        deferred.resolve(following);
      });


      return deferred.promise;

    }

    function getPhotos(){
      var deferred = $q.defer();
      $timeout(function(){
        var following = [
          {title:'Monument...',location:'img/gallery1.jpg',likes:10,comments:20,time:'Just Now'},
          {title:'Tigers...',location:'img/gallery2.jpg',likes:10,comments:20,time:'1 hour ago'},
          {title:'Monument...',location:'img/gallery3.jpg',likes:10,comments:20,time:'2 hours ago'},
          {title:'Pink Palace',location:'img/gallery4.jpg',likes:10,comments:20,time:'Just Now'},
          {title:'Falls',location:'img/gallery5.jpg',likes:10,comments:20,time:'1 hour ago'},
          {title:'Top View',location:'img/gallery6.jpg',likes:10,comments:20,time:'2 hours ago'}
        ];
        deferred.resolve(following);
      });


      return deferred.promise;

    }

    function getProfile() {
      var deferred = $q.defer();
      $timeout(function(){
        var profile = {
          followersCount: 201,
          followingCount: 10
        };
        deferred.resolve(profile);
      });


      return deferred.promise;


    }



  }

})();

angular.module("ionicplus").run(["$templateCache", function($templateCache) {$templateCache.put("modules/core/views/features.app.view.html","<ion-view view-title=\"Features\" cache-view=\"false\">\n    <ion-content >\n        <div class=\"content has-header\">\n            <div class=\"list\">\n                <a ui-sref=\"{{feature.link}}\" class=\"item  animated slideInRight\" ng-repeat=\"feature in featuresCtrl.features\" >\n                    {{feature.name}}\n\n                </a>\n\n            </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("modules/core/views/header.app.view.html","<ion-side-menus enable-menu-with-back-views=\"true\">\n    <ion-side-menu-content>\n        <ion-nav-bar class=\"bar-assertive-900\"  align-title=\"left\" animation=\"nav-title-slide-ios7\" >\n            <ion-nav-back-button class=\"no-text\">\n            </ion-nav-back-button>\n            <ion-nav-buttons side=\"right\">\n              <button data-ng-show=\"headerCtrl.isLoggedIn() || $root.isAppPreview\" ui-sref=\"app.features\" class=\"button button-icon button-clear ion-information-circled padding-right\"></button>\n              <button class=\"button button-icon button-clear ion-android-more-vertical\" menu-toggle=\"right\"></button>\n            </ion-nav-buttons>\n        </ion-nav-bar>\n        <ion-nav-view name=\"menuContent\" ></ion-nav-view>\n    </ion-side-menu-content>\n\n    <ion-side-menu side=\"right\" is-enabled=\"headerCtrl.isLoggedIn() || $root.isAppPreview\">\n        <ion-header-bar class=\"dark-bg\">\n\n            <h2 class=\"stable\">Ionic Plus</h2>\n        </ion-header-bar>\n        <ion-content >\n            <ion-list >\n                <ion-item nav-clear menu-close ui-sref=\"app.password\">\n                    Change Password\n                </ion-item>\n                <ion-item nav-clear menu-close ng-click=\"headerCtrl.signout()\">\n                    Log Out\n                </ion-item>\n\n\n\n            </ion-list>\n        </ion-content>\n    </ion-side-menu>\n\n</ion-side-menus>\n");
$templateCache.put("modules/features/views/admob.app.view.html","<ion-view view-title=\"AdMob\">\n  <ion-content >\n    <div class=\"padding \">\n\n      <button ng-click=\"adMobCtrl.showAd()\" class=\"button button-block button-positive\">Show Ad</button>\n\n    </div>\n  </ion-content>\n\n</ion-view>\n");
$templateCache.put("modules/features/views/camera.app.view.html","<ion-view view-title=\"Camera\">\n  <ion-content >\n    <div class=\"padding \">\n      <div class=\"button-bar\">\n\n        <button ng-click=\"cameraCtrl.getMedia(0)\" class=\"button button-block button-positive\">Take Picture</button>\n        <button ng-click=\"cameraCtrl.getMedia(1)\" class=\"button button-block button-positive\">Pick From Album</button>\n      </div>\n\n\n      <div class=\"image-padding-top\"></div>\n      <div class=\"add-image\" item-height=\"100\" collection-repeat=\"photo in cameraCtrl.photos track by $index\">\n        <img class=\"image-thumb\" ng-src=\"{{photo}}\" />\n      </div>\n\n\n\n\n    </div>\n  </ion-content>\n\n</ion-view>\n");
$templateCache.put("modules/features/views/maps.app.view.html","<ion-view view-title=\"Maps\" >\n\n  <ion-content scroll=\"false\" >\n    <div data-ng-show=\"mapsCtrl.showAutoPlaces\">\n      <label class=\"item item-input\">\n        <input  id=\"geocomplete\" name=\"geocomplete\"  type=\"text\" class=\"form-control\" placeholder=\"Enter Location\" autocomplete=\"off\"\n           places-auto-complete=\"\"  on-place-changed=\"placeChanged(place)\"  data-ng-model=\"mapsCtrl.geoname\" disable-tap>\n\n      </label>\n    </div>\n\n\n      <div id=\"maps-lazy-container\" map-lazy-load=\"http://maps.google.com/maps/api/js\" data-tap-disabled=\"true\">\n        <map style=\"width:100%;height:100%;\"\n           default-style=\"false\" id=\"search-map\"  scrollwheel=\"false\"\n           navigation-control=\"true\"    pan-control=\"false\" map-type-control=\"false\" scale-control=\"false\"\n           styles=\" [ { \'stylers\': [ { \'hue\': \'#0B3A5F\' }, { \'gamma\': 1 } ] } ]\"\n           mapTypeId=\"google.maps.MapTypeId.ROADMAP\">\n\n        </map>\n      </div>\n      <div class=\"overlap\" data-ng-show=\"!mapsCtrl.showAutoPlaces\" data-ng-init=\"active=\'food\'\">\n\n        <div class=\"overlap-item\" ng-click=\"active=\'food\';mapsCtrl.showNearbyPlaces(\'food\')\"  ng-class=\"{\'positive-bg\':active===\'food\'}\"><i class=\"icon  ion-fork\"></i></div>\n\n        <div class=\"overlap-item\" ng-click=\"active=\'shops\';mapsCtrl.showNearbyPlaces(\'shops\')\" ng-class=\"{\'positive-bg\':active===\'shops\'}\"><i class=\" icon ion-bag\"></i></div>\n\n\n\n      </div>\n\n\n\n\n\n  </ion-content>\n  <ion-tabs class=\"tabs-royal tabs-icon-top \">\n\n    <ion-tab on-select=\"mapsCtrl.tabSelected(\'auto\')\"  title=\"Auto Places\" icon-on=\"ion-ios-location\" icon-off=\"ion-ios-location-outline\">\n      <!-- Tab 1 content -->\n    </ion-tab>\n\n    <ion-tab on-select=\"mapsCtrl.tabSelected(\'nearby\')\"  title=\"Nearby Places\" icon-on=\"ion-ios-eye\" icon-off=\"ion-ios-eye-outline\">\n      <!-- Tab 2 content -->\n    </ion-tab>\n\n\n  </ion-tabs>\n\n\n</ion-view>\n");
$templateCache.put("modules/features/views/notifications.app.view.html","<ion-view view-title=\"Notifications\">\n  <ion-content >\n    <div class=\"padding notification-content-padding notification\">\n      <button ng-click=\"notificationsCtrl.initOneSignalNotification()\" class=\"button button-block button-positive\"\n      ng-if=\"!notificationsCtrl.enableOneSignalNotification\">Init OneSignal Notification</button>\n      <div ng-if=\"notificationsCtrl.enableOneSignalNotification\">\n        <label class=\"item item-input item-floating-label padding-bottom\">\n          <span class=\"input-label\">UserId</span>\n          <input type=\"text\" ng-model=\"notificationsCtrl.oneSignalPayload.userId\" ng-disabled=\"true\">\n        </label>\n        <label class=\"item item-input item-floating-label padding-bottom\">\n          <span class=\"input-label\">PushToken</span>\n          <input type=\"text\" ng-model=\"notificationsCtrl.oneSignalPayload.pushToken\" ng-disabled=\"true\">\n        </label>\n        <label class=\"item item-input item-floating-label padding-bottom\">\n          <span class=\"input-label\">Title</span>\n          <input type=\"text\" ng-model=\"notificationsCtrl.oneSignalPayload.title\" >\n        </label>\n        <label class=\"item item-input item-floating-label padding-bottom\">\n          <span class=\"input-label\">Content</span>\n          <input type=\"text\" ng-model=\"notificationsCtrl.oneSignalPayload.content\">\n        </label>\n        <button  ng-click=\"notificationsCtrl.sendOneSignalNotification()\" class=\"button button-block button-balanced\">Send OneSignal Notification</button>\n      </div>\n\n      <!--<button ng-disabled=\"true\" ng-click=\"notificationsCtrl.sendIonicNotification()\" class=\"button button-block button-positive\">Send Ionic Notification</button>-->\n\n    </div>\n  </ion-content>\n\n</ion-view>\n");
$templateCache.put("modules/users/views/feeds.app.view.html","<ion-view view-title=\"Feeds\" class=\"plus-bg\">\n    <ion-content  ng-class=\"{expanded:activityCtrl.isExpanded}\" >\n        <div class=\"list card \" ng-repeat=\"feed in feedsCtrl.feeds track by $index\" >\n            <div ui-sref=\"app.gallery\">\n                <div class=\"item item-avatar item-text-wrap\">\n                     <img ng-src=\"{{feed.location}}\"/>\n\n                    <strong>{{feed.name}}</strong>\n                    <p> {{feed.status}}</p>\n                    <p class=\"card-footer\">\n\n                      <span class=\"pull-left\"><i class=\"icon ion-clock\"></i> {{feed.time}}</span>\n                      <span class=\"pull-right icon-font\">\n                        <i class=\"icon ion-chatbubbles positive \"></i> {{feed.comments}}\n                        <i class=\"icon ion-heart assertive\"></i> {{feed.likes}}\n                      </span>\n                    </p>\n\n\n                </div>\n\n\n\n\n            </div>\n        </div>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("modules/users/views/friends.app.view.html","<ion-view view-title=\"Friends\" cache-view=\"false\">\n    <ion-content ng-class=\"{expanded:friendsCtrl.isExpanded}\">\n        <div class=\"content has-header\">\n            <div class=\"list\">\n                <a href=\"#/app/profile\" class=\"item item-avatar item-icon-right \" ng-repeat=\"person in friendsCtrl.friends track by $index\" >\n                    <img ng-src=\"{{person.location}}\">\n                    <h2>{{person.name}}</h2>\n                    <p>{{person.status}}</p>\n\n                </a>\n\n            </div>\n        </div>\n\n        <!--<div class=\"list content card \" ng-repeat=\"person in friendsCtrl.friends \">\n            <div ui-sref=\"app.profile\">\n              <div class=\"item item-avatar item-text-wrap \"  >\n                <img ng-src=\"{{person.location}}\">\n                <h2>{{person.name}}</h2>\n                <p>{{person.status}}</p>\n              </div>\n            </div>\n\n        </div>-->\n    </ion-content>\n</ion-view>\n");
$templateCache.put("modules/users/views/gallery.app.view.html","<ion-view view-title=\"Gallery\" cache-view=\"true\">\n\n    <ion-content ng-class=\"{expanded:galleryCtrl.isExpanded}\" >\n      <!--<a class=\"item item-list-detail\">\n          <ion-scroll direction=\"x\">\n            <img ng-repeat=\"photo in galleryCtrl.photos\" ng-src=\"{{photo.location}}\" class=\"image-list-thumb\"/>\n          </ion-scroll>\n      </a>-->\n\n\n        <div class=\"list\">\n            <div ui-sref=\"app.profile\" class=\"card card-gallery item item-text-wrap \" collection-repeat=\"photo in galleryCtrl.photos\"   >\n                <div class=\"dark-bg\" >\n                    <div class=\"padding\">\n                    <h2  >{{photo.title}}</h2>\n                    <div class=\"pull-right\">\n                      <a class=\"positive  padding-left\">\n                          <i class=\"icon ion-chatbubbles icon-right\"></i>\n                          {{photo.comments}}\n                      </a>\n                      <a class=\"assertive padding-left\" >\n                          <i class=\"icon ion-heart icon-right\"></i>\n                          {{photo.likes}}\n                      </a>\n                    </div>\n\n                  </div>\n                    <img class=\"full-image\"  ng-src=\"{{photo.location}}\">\n                </div>\n\n            </div>\n        </div>\n\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("modules/users/views/login.app.view.html","<ion-view  hide-nav-bar=\"true\" cache-view=\"false\" class=\"plus-bg\">\n  <ion-header-bar  class=\"bar-assertive-900\">\n\n    <div class=\"buttons\" >\n      <button  class=\"skip button  \" ng-click=\"loginCtrl.skip()\">Skip</button>\n    </div>\n  </ion-header-bar>\n    <ion-content class=\"login-plus plus-bg \" >\n\n      <div class=\"login-content\" >\n          <div class=\"text-center\">\n              <div class=\"content \">\n                <span class=\"login-icon login-icon-bg\">\n                  <i class=\"ion-plus icon\"></i>\n                </span>\n                  <h1>Ionic Plus</h1>\n\n              </div>\n          </div>\n          <!--<div class=\"list\">\n              <ion-md-input placeholder=\"UserName\" highlight-color=\"balanced\" type=\"text\"></ion-md-input>\n              <ion-md-input placeholder=\"Password\" highlight-color=\"energized\" type=\"text\"></ion-md-input>\n\n          </div>-->\n\n\n\n\n\n\n\n      </div>\n      <div class=\"bar bar-footer bar-dark\">\n        <div class=\"button-bar\">\n\n          <a  ng-click=\"loginCtrl.login()\" class=\"button  button-large button-assertive  \">Login</a>\n          <a ng-click=\"loginCtrl.signUp()\" class=\"button button-large button-calm  \">Sign Up</a>\n        </div>\n      </div>\n    </ion-content>\n\n\n\n\n\n\n</ion-view>\n");
$templateCache.put("modules/users/views/password.app.view.html","<ion-view class=\"plus-bg\" >\n    <ion-content class=\"plus-bg \" >\n      <div class=\"login-modal-content\">\n\n        <div class=\"login-input-padding\">\n          <label class=\"item item-input item-floating-label\">\n            <span class=\"input-label\">Current Password</span>\n              <input type=\"password\" ng-model=\"credentials.oldPassword\" placeholder=\"Current Password\">\n          </label>\n          <label class=\"item item-input item-floating-label\">\n            <span class=\"input-label\">New Password</span>\n              <input type=\"password\" ng-model=\"credentials.newPassword\" placeholder=\"New Password\">\n          </label>\n          <label class=\"item item-input item-floating-label\">\n            <span class=\"input-label\">Verify Password</span>\n              <input type=\"password\" ng-model=\"credentials.confirmNewPassword\" placeholder=\"New Password\">\n          </label>\n\n        </div>\n        <div class=\"login-button-padding\">\n          <button ng-click=\"passwordCtrl.changePassword(credentials)\" class=\"button button-block button-assertive  \"> Change </button>\n        </div>\n      </div>\n\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("modules/users/views/profile.app.view.html","<ion-view view-title=\"Profile\" cache-view=\"false\" >\n\n    <ion-content class=\"profile-content\" ng-class=\"{expanded:profileCtrl.isExpanded}\">\n        <div class=\"hero profile-bg \" >\n            <div class=\"content text-center\">\n\n\n                  <i class=\"calm icon ion-edit profile-edit \"> </i>\n                  <div class=\"avatar stable\" >\n                    <i class=\"icon ion-person avatar-icon\"></i>\n                  </div>\n\n                    <h3 class=\"calm\">{{profileCtrl.user.displayName}}</h3>\n                    <p class=\"calm\">\n                      <span class=\"profile-follow\">\n                        <strong>{{profileCtrl.profile.followersCount}}</strong> Followers\n                      </span>\n                        |\n                      <span class=\"profile-follow\">\n                        <strong>{{profileCtrl.profile.followingCount}} </strong>Following\n                      </span>\n                    </p>\n            </div>\n        </div>\n\n\n        <h4 class=\"content padding calm\">Following</h4>\n\n        <div class=\"list \">\n            <a ui-sref=\"app.friends\" class=\"item item-avatar item-icon-right \" collection-repeat=\"person in profileCtrl.following\" >\n                <img ng-src=\"{{person.location}}\"/>\n                <h2 class=\"calm\">{{person.name}}</h2>\n                <p class=\"stable\">{{person.status}}</p>\n\n            </a>\n\n        </div>\n\n        <div class=\"profile-list-padding\">\n        </div>\n\n    </ion-content>\n    <div class=\"tabs tabs-dark tabs-icon-top static\">\n      <a ui-sref=\"app.friends\" class=\"tab-item  \">\n          <i class=\"icon ion-android-people\"></i> Friends\n      </a>\n      <a ui-sref=\"app.gallery\" class=\"tab-item  \">\n          <i class=\"icon ion-images\"></i> Gallery\n      </a>\n      <a ui-sref=\"app.feeds\"  class=\"tab-item  \">\n          <i class=\"icon ion-calendar\"></i> Feeds\n      </a>\n\n\n    </div>\n</ion-view>\n");
$templateCache.put("modules/users/views/recover.modal.app.view.html","<ion-modal-view class=\"plus-bg\">\n   <ion-header-bar class=\"bar plus-bg\" align-title=\"center\">\n     <h1 class=\"title\">Recover</h1>\n     <button class=\"button button-clear \" ng-click=\"loginCtrl.closeRecoverModal()\">	<i class=\"icon ion-close\"></i></button>\n\n   </ion-header-bar>\n   <ion-content>\n    <div class=\"login-modal-content\">\n      <div class=\"login-input-padding\">\n        <span class=\"calm\"> An email will be sent to reset the password</span>\n        <label class=\"item item-input item-floating-label\">\n          <span class=\"input-label\">Email</span>\n            <input type=\"email\" ng-model=\"credentials.email\" placeholder=\"Email\">\n        </label>\n      </div>\n      <div class=\"login-button-padding\">\n        <button ng-click=\"loginCtrl.forgot(credentials)\" class=\"button button-block button-assertive  \"> Submit</button>\n        <br>\n        \n      </div>\n    </div>\n\n\n  </ion-content>\n\n\n</ion-modal-view>\n");
$templateCache.put("modules/users/views/signin.modal.app.view.html"," <ion-modal-view class=\"plus-bg\">\n    <ion-header-bar class=\"bar plus-bg\" align-title=\"center\">\n      <h1 class=\"title\">Login</h1>\n      <button class=\"button button-clear \" ng-click=\"loginCtrl.closeLoginModal()\">	<i class=\"icon ion-close\"></i></button>\n\n    </ion-header-bar>\n    <ion-content>\n      <div class=\"login-modal-content\">\n          <div class=\"login-input-padding\">\n            <label class=\"item item-input item-floating-label\">\n              <span class=\"input-label\">Username/Email</span>\n                <input type=\"text\" ng-model=\"credentials.email\" placeholder=\"Username/Email\">\n            </label>\n            <label class=\"item item-input item-floating-label\">\n              <span class=\"input-label\">Password</span>\n                <input type=\"password\" ng-model=\"credentials.password\" placeholder=\"Password\">\n            </label>\n          </div>\n          <div class=\"login-button-padding\">\n            <button ng-click=\"loginCtrl.signIn(credentials)\" class=\"button button-block button-assertive  \"> Submit</button>\n            <br>\n            <div class=\"text-center\"> Or </div>\n            <br>\n            <div class=\"button-bar\">\n              <button ng-click=\"loginCtrl.oauthSignin(\'facebook\')\" class=\"button button-positive button-small  ion-social-facebook  \"></button>\n              <button ng-click=\"loginCtrl.oauthSignin(\'twitter\')\" class=\"button button-calm button-small ion-social-twitter  \"></button>\n              <button ng-click=\"loginCtrl.oauthSignin(\'google\')\" class=\"button  button-assertive button-small ion-social-google  \"></button>\n            </div>\n            <br>\n            <br>\n            <p class=\"assertive\"><a ng-click=\"loginCtrl.recover()\">Forgot your password?</a></p>\n\n          </div>\n\n      </div>\n\n\n    </ion-content>\n\n\n  </ion-modal-view>\n");
$templateCache.put("modules/users/views/signup.modal.app.view.html"," <ion-modal-view class=\"plus-bg\">\n    <ion-header-bar class=\"bar plus-bg\" align-title=\"center\">\n      <h1 class=\"title\">Sign Up</h1>\n      <button class=\"button button-clear \" ng-click=\"loginCtrl.closeSignupModal()\">	<i class=\"icon ion-close\"></i></button>\n    </ion-header-bar>\n    <ion-content>\n      <div class=\"login-modal-content\">\n        <div class=\"login-input-padding\">\n          <label class=\"item item-input item-floating-label\">\n            <span class=\"input-label\">Username</span>\n              <input type=\"text\" ng-model=\"credentials.username\" placeholder=\"Username\">\n          </label>\n          <label class=\"item item-input item-floating-label\">\n            <span class=\"input-label\">Email</span>\n              <input type=\"email\" ng-model=\"credentials.email\" placeholder=\"Email\">\n          </label>\n          <label class=\"item item-input item-floating-label\">\n            <span class=\"input-label\">Password</span>\n              <input type=\"password\" ng-model=\"credentials.password\" placeholder=\"Password\">\n          </label>\n\n      </div>\n      <div class=\"login-button-padding\">\n        <button ng-click=\"loginCtrl.createUser(credentials)\" class=\"button button-block button-assertive  \"> Submit</button>\n      </div>\n    </div>\n\n    </ion-content>\n\n\n  </ion-modal-view>\n");}]);
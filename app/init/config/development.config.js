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

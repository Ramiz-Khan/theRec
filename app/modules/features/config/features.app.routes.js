'use strict';

// Setting up route
angular.module('features').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('app.notifications', {
			url: '/notifications',
			views: {
				'menuContent': {
					templateProvider: function($templateCache){
						return $templateCache.get('modules/features/views/notifications.app.view.html');
					},
					controller:'NotificationsCtrl as notificationsCtrl'

				}

			}

		})
		.state('app.admob', {
			url: '/admob',
			views: {
				'menuContent': {
					templateProvider: function($templateCache){
						return $templateCache.get('modules/features/views/admob.app.view.html');
					},
					controller:'AdMobCtrl as adMobCtrl'

				}

			}

		})
		.state('app.maps', {
			url: '/maps',
			views: {
				'menuContent': {
					templateProvider: function($templateCache){
						return $templateCache.get('modules/features/views/maps.app.view.html');
					},
					controller:'MapsCtrl as mapsCtrl'

				}

			}

		})
		.state('app.camera', {
			url: '/camera',
			views: {
				'menuContent': {
					templateProvider: function($templateCache){
						return $templateCache.get('modules/features/views/camera.app.view.html');
					},
					controller:'CameraCtrl as cameraCtrl'

				}

			}

		});




	}
]);

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
			templateProvider: function($templateCache){
        return $templateCache.get('modules/core/views/header.app.view.html');
      },
			controller:'HeaderCtrl as headerCtrl'

		})
	 	.state('app.features', {
			url: '/features',
			views: {
				'menuContent': {
					templateProvider: function($templateCache){
						return $templateCache.get('modules/core/views/features.app.view.html');
					},
					controller:'FeaturesCtrl as featuresCtrl'

				}

			}

		});

	}
]);

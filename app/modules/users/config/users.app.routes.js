'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateProvider: function($templateCache){
                 return $templateCache.get('modules/users/views/login.app.view.html');
                },
                controller: 'LoginCtrl as loginCtrl'
            }
        }

    })
    .state('app.password', {
        url: '/password',
        views: {
            'menuContent': {
                templateProvider: function($templateCache){
                 return $templateCache.get('modules/users/views/password.app.view.html');
                },
                controller: 'PasswordCtrl as passwordCtrl'
            }
        }

    })
    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateProvider: function($templateCache){
                 return $templateCache.get('modules/users/views/profile.app.view.html');
                },
                controller: 'ProfileCtrl as profileCtrl'

            }
        }

    })
    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateProvider: function($templateCache){
                 return $templateCache.get('modules/users/views/friends.app.view.html');
                },
                controller: 'FriendsCtrl as friendsCtrl'

            }


        }
    })
    .state('app.feeds', {
        url: '/feeds',
        views: {
            'menuContent': {
                templateProvider: function($templateCache){
                 return $templateCache.get('modules/users/views/feeds.app.view.html');
                },
                controller: 'FeedsCtrl as feedsCtrl'

            }
        }

    })
    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateProvider: function($templateCache){
                 return $templateCache.get('modules/users/views/gallery.app.view.html');
                },
                controller: 'GalleryCtrl as galleryCtrl'

            }
        }
    });
  }
]);

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

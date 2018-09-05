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

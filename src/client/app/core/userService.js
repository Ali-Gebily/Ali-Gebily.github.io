/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service for authentication management of current user.
 *
 * @author TCSCODER, TCSCODER
 * @version 1.1
 * 
 * Changes in 1.1:
 *   Living Progress - Build - WWF - Data Download and Security Enhancements v1.0:
 *   https://www.topcoder.com/challenge-details/30056081
 */
(function () {
    'use strict';
    angular.module('app.core').factory('userService', ['$http', '$q', 'storage', 'config', 'serverProxy', 'currentUser',
        function ($http, $q, storage, config, serverProxy, currentUser) {
            var instance = {};

            instance.reloadCurrentUser = function () {
                var deferred = $q.defer();

                serverProxy.makeRequest({
                    method: 'GET',
                    url: '/users/me'
                }).then(function (result) {
                    currentUser.set(result);
                    deferred.resolve(result);
                },
                    function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            };

            instance.update = function (user) {
                var deferred = $q.defer();

                return serverProxy.makeRequest({
                    method: 'PUT',
                    url: '/users',
                    data: user
                }).then(function (result) {
                    currentUser.set(result);
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            instance.getUser = function (username) {
                var deferred = $q.defer();

                serverProxy.makeRequest({
                    method: 'GET',
                    url: '/users/' + username
                }).then(function (result) {
                    deferred.resolve(result);
                },
                    function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            };
            
            var _photoRespone = {};
            instance.getUserPhoto = function (username) {
                if (_photoRespone[username]) {
                    return _photoRespone[username].promise;
                }
                else {
                    var deferred = $q.defer();
                    _photoRespone[username] = deferred;
                    serverProxy.makeRequest({
                        method: 'GET',
                        url: '/users/' + username + '/photo'
                    }).then(function (result) {
                        deferred.resolve(result);
                    },
                        function (error) {
                            deferred.reject(error);
                        });
                }
                return deferred.promise;
            };

            instance.requestPasswordReset = function (usernameOrEmail) {
                return serverProxy.makeRequest({
                    method: 'POST',
                    url: '/users/requestPasswordReset?usernameOrEmail=' + usernameOrEmail
                }, true);
            };

            instance.resetPassword = function (passwordResetKey, newPassword) {
                return serverProxy.makeRequest({
                    method: 'PUT',
                    url: '/users/resetPassword?passwordResetKey=' + passwordResetKey + '&newPassword=' + newPassword
                }, true);
            };

            return instance;
        }]);
})();
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
    angular.module('app.core').factory('currentUser', ['$http', '$q', 'storage', 'config', 'httpHelper',
        function ($http, $q, storage, config, httpHelper) {

            var instance = {};
            instance.userInfo = {};
            var userProfile = null;

            function setUser(user) {
                storage.setCurrentUserProfile(user);
                userProfile = user;
                if (userProfile) {
                    instance.userInfo.isLoggedIn = true;
                    instance.userInfo.isAdmin = userProfile.isAdmin;
                    instance.userInfo.id = userProfile.id;
                    instance.userInfo.username = !userProfile.username ? (userProfile.firstName + ' ' + userProfile.lastName) : userProfile.username;
                    instance.userInfo.firstName = userProfile.firstName;
                    instance.userInfo.lastName = userProfile.lastName;
                    instance.userInfo.photoUrl = userProfile.photoUrl;
                    instance.userInfo.photo = userProfile.photo;
                    instance.userInfo.weightDiscrepancyThreshold = userProfile.weightDiscrepancyThreshold;
                    instance.userInfo.volumeChangesThreshold = userProfile.volumeChangesThreshold;
                }
                else {
                    instance.userInfo.isLoggedIn = false;
                    instance.userInfo.isAdmin = false;
                    instance.userInfo.id = 0;
                    instance.userInfo.username = null;
                }
            };

            setUser(storage.getCurrentUserProfile());

            instance.login = function (username, password) {
                var deferred = $q.defer();

                httpHelper.makeRequest({
                    method: 'POST',
                    url: '/login',
                    data: { username: username, password: password }
                }).success(function (result) {
                    storage.setSessionToken(result.token.tokenValue);
                    setUser(result.user);
                    deferred.resolve(result.user);
                }).error(function (data, status) {
                    deferred.reject({ message: data, status: status });
                });

                return deferred.promise;
            };

            instance.updateApiToken = function (token) {
                storage.setSessionToken(token);

                var deferred = $q.defer();
                httpHelper.makeRequest({
                    method: 'GET',
                    url: '/users/me'
                }).success(function (data) {
                    setUser(data);
                    deferred.resolve(data);
                }).error(function (data, status) {
                    deferred.reject({ message: data, status: status });
                });
                return deferred.promise;
            };

            instance.logout = function () {
                httpHelper.makeRequest({
                    method: 'POST',
                    url: '/logout'
                });

                storage.setSessionToken(null);
                setUser(null);
            };

            instance.get = function () {
                // clone current user
                return JSON.parse(JSON.stringify(userProfile));
            };

            instance.set = function (user) {
                setUser(user);
            };

            instance.register = function (user) {
                var deferred = $q.defer();

                var req = {
                    method: 'POST',
                    url: config.REST_API_BASE_URL + '/register',
                    data: user,
                    cache: false
                };

                $http(req).success(function (data) {
                    storage.setSessionToken(data.token.tokenValue);
                    setUser(data.user);
                    deferred.resolve(data.user);
                })
                .error(function (data, status) {
                    deferred.reject({ message: data, status: status });
                });

                return deferred.promise;
            };

            return instance;
        }]);
})();
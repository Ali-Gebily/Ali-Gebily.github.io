/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Angular service that abstracts the sessionToken and current user profile storage/retrieval.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('storage', [function () {
            var service = {};

            /**
             * Returns the stored token
             * This method first checks in sessionStorage if token is not found in sessionStorage
             * this method checks in localStorage, if token still not found in localStorage, then it will return null
             * or undefined
             * The controllers has to implement the logic that if token is null/undefined then user is not authorized
             */
            service.getSessionToken = function () {
                var token = localStorage.getItem('wwf.auth.token');
                // return angular.fromJson(token);
                return token;
            };

            /**
             * Store the session token in sessionStorage
             * A boolean flag is passed which when true indicate that user chose remember me option and data should
             * also be stored in localStorage
             */
            service.setSessionToken = function (sessionToken, rememberMe) {
                // sessionToken = angular.toJson(sessionToken);
                localStorage.setItem('wwf.auth.token', sessionToken);
                //if (rememberMe) {
                //    localStorage.setItem('wwf.auth.token', sessionToken);
                //}
            };

            /**
             * Get current user profile stored in sessionStorage or localStorage
             */
            service.getCurrentUserProfile = function () {
                var profile = localStorage.getItem('wwf.auth.profile');
                if (profile) {
                    return angular.fromJson(profile);
                }
                return null;
            };

            /**
             * Store the current user profile in sessionStorage
             * A boolean flag is passed which when true indicate that user chose remember me option and
             * data should also be stored in localStorage
             */
            service.setCurrentUserProfile = function (profile) {
                profile = angular.toJson(profile);
                localStorage.setItem('wwf.auth.profile', profile);
            };

            service.setValue = function (key, value) {
                value = angular.toJson(value);
                localStorage.setItem(key, value);
            };

            service.getValue = function (key) {
                var value = localStorage.getItem(key);
                return angular.fromJson(value);
            };

            /**
             * Utility method to clear the sessionStorage and localStorage
             */
            service.clear = function () {
                sessionStorage.clear();
                localStorage.clear();
            };
            return service;
        }]);
})();
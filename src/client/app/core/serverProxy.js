/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * The service that acts as a REST API proxy.
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

    angular
        .module('app.core')
        .factory('serverProxy', ['$http', '$state', '$q', '$location', 'config', 'storage', 'util', 'httpHelper',
            function ($http, $state, $q, $location, config, storage, util, httpHelper) {
                var instance = {};

                instance.makeRequest = function (options, allowAnonymous) {
                    var deferred = $q.defer();

                    httpHelper.makeRequest(options, allowAnonymous).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        if (status == 401) {
                            util.login();
                            return;
                        }
                        deferred.reject({ message: data, status: status });
                    });

                    return deferred.promise;
                };

                return instance;
            }]);
})();
/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * The service that acts as a REST API proxy.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular.module('app.core')
        .factory('httpHelper', ['$http', '$state', '$q', '$location', 'config', 'storage',
            function ($http, $state, $q, $location, config, storage) {
                var instance = {};

                function execute(options) {
                    if (options.url.indexOf("http") !== 0) {
                        options.url = config.REST_API_BASE_URL + options.url;
                    }

                    options.cache = false;
                    return $http(options);
                };

                instance.makeRequest = function (options, allowAnonymous) {
                    if (!allowAnonymous) {
                        var token = storage.getSessionToken();
                        if (!options.headers) {
                            options.headers = {};
                        }

                        options.headers.Authorization = 'Bearer ' + token;
                    }
                    return execute(options);
                };

                return instance;
            }]);
})();
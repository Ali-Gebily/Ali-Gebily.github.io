/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service for retrieving and reloading alerts as well as managing alerts configuration.
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
    angular.module('app.alertsearch').service('alertService', ['serverProxy', function (serverProxy) {

        this.getConfiguration = function () {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/alerts/configuration'
            });
        };

        this.getThreshold = function () {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/alerts/threshold'
            });
        };

        this.saveConfiguration = function (config) {
            return serverProxy.makeRequest({
                method: 'POST',
                url: '/alerts/configuration',
                data: config
            });
        };

        this.loadFromVertica = function (query) {
            return serverProxy.makeRequest({
                method: 'POST',
                url: '/alerts/reloadFromVertica'
            });
        };

        this.search = function (criteria) {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/alerts',
                params: criteria
            }, true);
        };
    }]);
})();
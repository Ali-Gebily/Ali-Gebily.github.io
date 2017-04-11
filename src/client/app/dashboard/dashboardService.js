/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service for querying dashboard data.
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
    angular.module('app.dashboard').service('dashboardService', ['serverProxy', function (serverProxy) {

        this.getExporters = function (criteria) {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/exporters',
                params: criteria
            }, true);
        };

        this.getImporters = function (criteria) {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/importers',
                params: criteria
            }, true);
        };

        this.getTopValuePerKgCommodities = function (params) {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/topValuePerKgCommodities',
                params: params
            }, true);
        };

        this.getTopOverallValueCommodities = function (params) {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/commoditiesTotalValues',
                params: params
            }, true);
        };

        this.reloadFromVertica = function (dashboardYear) {
            return serverProxy.makeRequest({
                method: 'POST',
                url: '/dashboard/reloadAll?dashboardYear=' + dashboardYear
            });
        };
    }]);
})();
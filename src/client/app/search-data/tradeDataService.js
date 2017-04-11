/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service for querying trade data.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';
    angular.module('app.searchdata').service('tradeDataService', ['serverProxy', function (serverProxy) {

        this.getAllCountries = function () {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/tradeData/countries'
            }, true);
        };

        this.getAllCommodities = function () {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/tradeData/commodities'
            }, true);
        };

        this.search = function (query) {
            return serverProxy.makeRequest({
                method: 'POST',
                url: '/tradeData/search',
                data: query
            }, true);
        };

        this.saveQuery = function (query) {
            return serverProxy.makeRequest({
                method: 'POST',
                url: '/tradeData/queries',
                data: query
            });
        };

        this.searchUserQueries = function (criteria) {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/tradeData/queries',
                params: criteria
            });
        };

        this.deleteUserQuery = function (name) {
            return serverProxy.makeRequest({
                method: 'DELETE',
                url: '/tradeData/queries/' + name
            });
        };
    }]);
})();
/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service for retrieving lookup models.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';
    angular.module('app').service('lookupService', ['serverProxy', function (serverProxy) {
        this.getAllCountries = function () {
            return serverProxy.makeRequest({
                method: 'GET',
                url: '/lookup/countries'
            }, true);
        };
    }]);
})();
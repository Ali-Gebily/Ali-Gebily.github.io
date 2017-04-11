/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for query list page.
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
      .module('app.querylist')
      .controller('QueryListController', QueryListController);

    QueryListController.$inject = ['$scope', '$state', '$filter', 'loginModal', '$window', 'dataservice', '$q', 'util', 'currentUser', 'tradeDataService'];
    /* @ngInject */
    function QueryListController($scope, $state, $filter, loginModal, $window, dataservice, $q, util, currentUser, tradeDataService) {
        var vm = this;
        vm.title = 'Query List';

        $scope.userInfo = currentUser.userInfo;
        if (!$scope.userInfo.isLoggedIn) {
            util.login();
            return;
        }

        $scope.queries = [];
        $scope.criteria = {};
        $scope.showFilterPanel = false;

        function init() {
            initDatePickers();

            $q.all([
                tradeDataService.getAllCommodities(),
                tradeDataService.getAllCountries()]).then(function (data) {
                    // commodities
                    $scope.commodoties = data[0];

                    // countries
                    $scope.countries = data[1];
                    for (var index in data) {
                        $scope.countries[index].fullName = $scope.countries[index].code + ' - ' + $scope.countries[index].fullName;
                    }
                    util.stylizeSelectBox('#SelectBoxImporterCountry');

                    // load user queries data
                    vm.search();
                }, util.handleHttpError);
        };

        vm.clearFields = function () {
            $scope.criteria = {};
            util.clearDropdownValue('#SelectBoxImporterCountry');
        };

        $scope.toggleFilterPanel = function (show) {
            $scope.showFilterPanel = show;
        };

        $scope.changePage = function (pageNumber, pageSize) {
            $scope.criteria.pageNumber = pageNumber;
            $scope.criteria.pageSize = pageSize;
            if ($scope.countries) {
                // search only when all data is loaded
                vm.search();
            }
        };

        vm.search = function () {
            tradeDataService.searchUserQueries($scope.criteria).then(function (result) {
                $scope.queries = result.items;
                $scope.groupedQueries = [];

                for (var index in $scope.queries) {
                    var query = $scope.queries[index];
                    if (index % 3 == 0) {
                        $scope.groupedQueries.push([]);
                    }
                    $scope.groupedQueries[Math.floor(index / 3)].push(query);
                    query.importerCountryNames = getCountryNames(query.importerCountryCodes);
                    query.exporterCountryNames = getCountryNames(query.exporterCountryCodes);
                    query.commodityNames = getCommodityNames(query.commodityCodes);
                }
                
                vm.totalItems = result.totalRecords;
                $scope.displayFromIndex = ($scope.criteria.pageNumber - 1) * $scope.criteria.pageSize + 1;
                $scope.displayToIndex = Math.min($scope.displayFromIndex + $scope.criteria.pageSize - 1, vm.totalItems);
                updateCharts();
            }, util.handleHttpError);
        };

        function updateCharts() {
            for (var index in $scope.queries) {
                var query = $scope.queries[index];
                (function (query) {
                    tradeDataService.search(query).then(function (result) {
                        util.drawTradeDataLineChart('#myQueryChart' + query.id, query, result);
                    }, util.handleHttpError);
                })(query);
            }
        };

        function getCountryNames(countryCodes) {
            var result = [];
            for (var index in countryCodes) {
                var country = getCountryByCode(countryCodes[index]);
                result.push(country.fullName);
            }
            return util.toCsv(result);
        };

        function getCommodityNames(commodityIds) {
            var result = [];
            for (var index in commodityIds) {
                var commodity = getCommodityById(commodityIds[index]);
                result.push(commodity.name);
            }
            return util.toCsv(result);
        };

        vm.delete = function (query) {
            if (confirm('Are you sure you want to delete selected query?')) {
                tradeDataService.deleteUserQuery(query.name).then(function () {
                    alert('Query successfully deleted!');

                    var index = $scope.queries.indexOf(query);
                    if (index > -1) {
                        $scope.queries.splice(index, 1);
                    }
                }, util.handleHttpError);
            }
        };

        vm.edit = function (query) {
            $state.go('searchdata', { query: query });
        };

        vm.view = function (query) {
            $state.go('datacompare', { query: query });
        };

        function initDatePickers() {
            util.initDatePicker("#createdOnCriteria");
            util.initDatePicker("#lastUpdatedOnCriteria");
        }

        function getCommodityById(id) {
            var items = $filter('filter')($scope.commodoties, { id: id.trim() }, true);
            return items.length ? items[0] : null;
        };

        function getCountryByCode(code) {
            var items = $filter('filter')($scope.countries, { code: code }, true);
            return items.length ? items[0] : null;
        };

        // initialize
        init();
    }
})();

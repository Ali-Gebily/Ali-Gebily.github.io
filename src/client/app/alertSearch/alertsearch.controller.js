/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for alerts search page.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular
      .module('app.alertsearch')
      .controller('AlertSearchController', AlertSearchController);

    AlertSearchController.$inject = ['$scope', '$state', '$q', '$filter', 'loginModal', 'currentUser', 'lookupService', 'alertService', 'tradeDataService', 'util'];

    /* @ngInject */
    function AlertSearchController($scope, $state, $q, $filter, loginModal, currentUser, lookupService, alertService, tradeDataService, util) {
        var vm = this;

        function init() {
            $scope.userInfo = currentUser.userInfo;
            vm.title = 'Alert Search';
            vm.login = util.login;
            vm.showSearchResults = false;
            vm.criteria = { alertType: 'ImportExportDiscrepancy' };
            vm.commodities = [];
            vm.countries = [];
            // pagination parameters
            vm.totalItems = 0;
            vm.currentPage = 1;
            vm.sortAscending = false;

            $q.all([
                tradeDataService.getAllCommodities(),
                tradeDataService.getAllCountries()]).then(function (data) {
                    // commodities
                    vm.commodities = data[0];

                    _.forEach(vm.commodities, function(item) {
                        if(item.name !== null && item.name.lastIndexOf(':') > 0){
                            item.name = item.name.substring(0, item.name.lastIndexOf(':') +  1) + '<strong>' + item.name.substring(item.name.lastIndexOf(':') +  1) +'</strong>';
                        }
                    });

                    // countries
                    vm.countries = data[1];
                    for (var index in data[1]) {
                        vm.countries[index].fullNameWithCode = vm.countries[index].code + ' - ' + vm.countries[index].fullName;
                    }
                    util.stylizeSelectBox('#SelectBoxImporter');
                    util.stylizeSelectBox('#SelectBoxExporter');
                    util.stylizeSelectBox('#SelectBoxCommodity');
                }, util.handleHttpError);
        };

        vm.changePage = function (pageNumber, pageSize) {
            vm.criteria.pageNumber = pageNumber;
            vm.criteria.pageSize = pageSize;
            if (vm.countries.length) {
                // search only when all data is loaded
                vm.search();
            }
        };

        vm.sort = function (sortBy, ascending) {
            vm.sortAscending = ascending;
            vm.criteria.sortBy = sortBy;
            vm.criteria.sortType = ascending ? 'Ascending' : 'Descending';
            vm.search();
        };

        vm.search = function () {
            alertService.search(vm.criteria).then(function (result) {
                vm.alerts = result.items;
                vm.showSearchResults = true;
                util.withTimeout(function () { util.scrollTo('query-results-section', 130); });

                vm.totalItems = result.totalRecords;
                vm.displayFromIndex = !vm.totalItems ? 0 : (vm.criteria.pageNumber - 1) * vm.criteria.pageSize + 1;
                vm.displayToIndex = Math.min(vm.displayFromIndex + vm.criteria.pageSize - 1, vm.totalItems);
            }, util.handleHttpError);
        };

        vm.viewDetail = function (alert) {
            alert.exporterName = vm.getCountryByCode(alert.exporterCode).fullName;
            alert.importerName = vm.getCountryByCode(alert.importerCode).fullName;
            alert.commodityName = vm.getCommodityById(alert.commodityCode).trimmedName;
            $state.go('alertdetail', { alert: alert });
        };

        vm.getCommodityById = function (id) {
            var items = $filter('filter')(vm.commodities, { id: id.trim() }, true);
            return items.length ? items[0] : null;
        };

        vm.getCountryByCode = function (code) {
            var items = $filter('filter')(vm.countries, { code: code }, true);
            return items.length ? items[0] : null;
        };

        init();
    }
})();

/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for user search data page.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular
      .module('app.searchdata')
      .controller('SearchDataController', SearchDataController);

    SearchDataController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'util', 'currentUser', 'tradeDataService', 'config'];
    /* @ngInject */
    function SearchDataController($scope, $state, $stateParams, $filter, util, currentUser, tradeDataService, config) {
        $scope.userInfo = currentUser.userInfo;

        var vm = this;
        vm.title = 'Search Data';
        vm.login = util.login;

        $scope.periodYears = config.PERIOD_YEARS;
        $scope.onlyWildCaught = true;

        if ($stateParams.query) {
            $scope.query = $stateParams.query;
        }
        else {
            $scope.query = {
                yearStart: 2014,
                yearEnd: 2015,
                tradeBy: 'volume',
                importerCountryCodes: [],
                exporterCountryCodes: [],
                commodityCodes: []
            };
        }

        function init() {
            // apply nice select
            util.applyNiceSelect('select.dropdown-show.yearStart');
            util.applyNiceSelect('select.dropdown-show.yearEnd');

            // load commodities
            tradeDataService.getAllCommodities().then(function (data) {
                $scope.commodoties = data;             
                util.stylizeMultiSelectBox('#SelectBoxCommodities', '.query-fisheries-product', 'Select Commodities');
                util.withTimeout(vm.filterCommodities);                
            }, util.handleHttpError);

            tradeDataService.getAllCountries().then(function (data) {
                $scope.countries = data;
                for (var index in data) {
                    $scope.countries[index].fullName = $scope.countries[index].code + ' - ' + $scope.countries[index].fullName;
                }

                util.stylizeMultiSelectBox('#SelectBoxReporter', '.query-reporter-country', 'Select Importer');
                util.stylizeMultiSelectBox('#SelectBoxPartner', '.query-partner-country', 'Select Exporter');
            }, util.handleHttpError);
        };

        vm.filterCommodities = function () {
            $('.optWrapper .options .opt', $('#SelectBoxCommodities').parent()).each(function (index, item) {
                var name = $('label', $(item)).text();                
                var commodity = getCommodityByName(name);                
                if (commodity && commodity.source !== 'Wild-caught') {
                    $(item).toggle(!$scope.onlyWildCaught);
                }
                if(name.lastIndexOf(':') > 0){
                    $('label', $(item)).html(name.substring(0, name.lastIndexOf(':') +  1) + '<strong>' + name.substring(name.lastIndexOf(':') +  1) +'</strong>');
               }
            });
        };

        vm.search = function () {
            if (util.validateSearchQuery($scope.query, showMessage)) {
                $state.go('datacompare', { query: $scope.query });
            }
        }

        vm.save = function () {
            if (!util.validateSearchQuery($scope.query, showMessage)) {
                return;
            }
            if (!$scope.query.name) {
                showMessage('Query validation error!', 'Please enter query name.');
                return;
            }

            tradeDataService.saveQuery($scope.query).then(function () {
                showMessage('Info', 'Query successfully saved!');
            }, util.handleHttpError);
        };

        function getCommodityByName(name) {            
            var items = $filter('filter')($scope.commodoties, { name: name.trim() }, true);
            return items.length ? items[0] : null;
        };

        vm.getCommodityById = function (id) {
            if (!$scope.commodoties) {
                return null;
            }
            var items = $filter('filter')($scope.commodoties, { id: id.trim() }, true);
            return items.length ? items[0] : null;
        };

        vm.getCountryByCode = function (code) {
            if (!$scope.countries) {
                return null;
            }
            var items = $filter('filter')($scope.countries, { code: code }, true);
            return items.length ? items[0] : null;
        };

        function showMessage(title, message) {
            vm.messageTitle = title;
            vm.messageText = message;
            vm.showMessage = true;
        };

        init();
    }
})();

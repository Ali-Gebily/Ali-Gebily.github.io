/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for data comparison page.
 *
 * @author TCSCODER, TCSCODER
 * @version 1.1
 * 
 * Changes in 1.1:
 * Implemented requirements for 'WWF - Results Display and Forum Publishing v1.0' challenge:
 * https://www.topcoder.com/challenge-details/30055325
 */
(function () {
    'use strict';

    angular
      .module('app.data.comparison')
      .controller('DataComparisonController', DataComparisonController);

    DataComparisonController.$inject = ['$q', '$state', '$stateParams', '$scope', '$filter', '$window', 'config', 'util', 'currentUser', 'tradeDataService', 'ContentfulService'];

    /* @ngInject */
    function DataComparisonController($q, $state, $stateParams, $scope, $filter, $window, config, util, currentUser, tradeDataService, ContentfulService) {
        $scope.userInfo = currentUser.userInfo;
        if (!$stateParams.query) {
            // TODO: restore
            $stateParams.query = {
                name: 'test query 1',
                tradeBy: 'volume',
                yearStart: 2005,
                yearEnd: 2015,
                importerCountryCodes: [97, 124, 643],
                exporterCountryCodes: [36],
                commodityCodes: ['0301'],
                createdOn: '2016-12-08 17:41:27.307',
                lastUpdatedOn: '2016-12-08 19:45:12.010'
            };

            // $state.go('searchdata');
            // return;
        }

        var vm = this;
        vm.title = 'Data Comparison';
        vm.login = util.login;
        vm.post = {
            includeChart: true,
            includeMap: true
        };
        $scope.activeTab = 'chart';
        $scope.keyFindings = [];
        $scope.sortType = 'com.year'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchYear = '';     // set the default search/filter term
        $scope.sliderYear = '';

        $scope.periodYears = config.PERIOD_YEARS;
        $scope.onlyWildCaught = true;
        $scope.query = $stateParams.query;

        function init() {
            // apply nice select
            util.applyNiceSelect('select.dropdown-show.yearStart');
            util.applyNiceSelect('select.dropdown-show.yearEnd');

            $q.all([
                tradeDataService.getAllCommodities(),
                tradeDataService.getAllCountries()]).then(function (data) {
                    // commodities
                    $scope.commodoties = data[0];                    
                    util.stylizeMultiSelectBox('#SelectBoxCommodities', '.query-fisheries-product', 'Select Commodities');
                    util.withTimeout($scope.filterCommodities);

                    // countries
                    $scope.countries = data[1];
                    for (var index in $scope.countries) {
                        $scope.countries[index].fullName = $scope.countries[index].code + ' - ' + $scope.countries[index].fullName;
                    }

                    util.stylizeMultiSelectBox('#SelectBoxReporter', '.query-reporter-country', 'Select Importer');
                    util.stylizeMultiSelectBox('#SelectBoxPartner', '.query-partner-country', 'Select Exporter');

                    // load query data
                    reload();
                }, util.handleHttpError);

            var refreshTimeout;
            var w = angular.element($window);
            var resizeHandler = function () {
                clearTimeout(refreshTimeout);
                refreshTimeout = setTimeout(function () {
                    redrawGraphics(true);
                }, 50);
            }
            w.bind('resize', resizeHandler);
            $scope.$on('$destroy', function() {
            w.unbind('resize', resizeHandler);
            });
        };

        $scope.filterCommodities = function () {
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
            reload();
        }

        vm.save = function () {
            if (!util.validateSearchQuery($scope.query)) {
                return;
            }
            if (!$scope.query.name) {
                util.showMessage(vm, 'Success', 'Please enter query name.');
                return;
            }

            util.hideAllPopups();
            tradeDataService.saveQuery($scope.query).then(function () {
                util.showMessage(vm, 'Success', 'Query successfully saved!');
                if (!$scope.query.createdOn) {
                    $scope.query.createdOn = new Date();
                }
                $scope.query.lastUpdatedOn = new Date();
            }, util.handleHttpError);
        };

        $scope.updateMap = function (yearValue) {            
            $scope.sliderYear = yearValue;
            if($scope.tradeData)
            {
                var importers = {};
                var exporters = {};

                var yearData = _.filter($scope.tradeData, function(o) { return o.year === $scope.sliderYear; });

                 for (var index = 0; index < yearData.length; index++) {
                    var item = yearData[index];
                    var importAmount = isTradeByVolume() ? item.importedVolume : item.importedValue;
                    var exportAmount = isTradeByVolume() ? item.exportedVolume : item.exportedValue;

                    // Remove country code from full name
                    if(item.exporterCountryCode && item.exporter.indexOf(item.exporterCountryCode) > -1 )
                    {
                        item.exporter = item.exporter.split("-")[1].trim();
                    }
                    if(item.importerCountryCode && item.importer.indexOf(item.importerCountryCode) > -1 )
                    {
                        item.importer = item.importer.split("-")[1].trim();
                    }

                    // aggregate importers                   

                    if (!importers[item.importer]) {
                        importers[item.importer] = "-";
                    }
                    if (importAmount !== null) {
                        if (isNaN(importers[item.importer])) {                            
                            importers[item.importer] = 0;
                        }
                        importers[item.importer] += importAmount;
                    }   
                    // aggregate exporters
                    if (!exporters[item.exporter]) {
                        exporters[item.exporter] = "-";
                    }
                    if (exportAmount !== null) {
                        if (isNaN(exporters[item.exporter])) {                                                       
                            exporters[item.exporter] = 0;
                        }
                        exporters[item.exporter] += exportAmount;
                    }
                 }

                if(importers['EU-27'])
                {
                    _.forEach(getEUCountries(), function(euCountry) {
                        importers[euCountry] = importers['EU-27'];
                    });
                }
                if(exporters['EU-27'])
                {
                    _.forEach(getEUCountries(), function(euCountry) {
                        exporters[euCountry] = exporters['EU-27'];
                    });
                }
                $scope.mapData = {
                    importers: importers,
                    exporters: exporters,
                    tradeBy: $scope.query.tradeBy
                };                
                // draw map
                util.drawMap($scope.mapData.importers, $scope.mapData.exporters, $scope.mapData.tradeBy, 'dataComparisonMap',true);    
            }
        };

        function getEUCountries(){             
            return [    
                    'Austria',
                    'Belgium',
                    'Bulgaria',
                    'Croatia',
                    'Republic of Cyprus',
                    'Czech Republic', 
                    'Denmark', 
                    'Estonia', 
                    'Finland',
                    'France', 
                    'Germany',
                    'Greece', 
                    'Hungary', 
                    'Ireland', 
                    'Italy',
                    'Latvia', 
                    'Lithuania', 
                    'Luxembourg', 
                    'Netherlands', 
                    'Poland', 
                    'Portugal', 
                    'Romania', 
                    'Slovakia', 
                    'Slovenia', 
                    'Spain', 
                    'Sweden'
                ];
                
        };

        vm.setActiveTab = function(tab) {
            $scope.activeTab=tab;
            util.withTimeout(function () {
                util.arrangeMarkers();
            }, 50);
            
        }

        vm.publishToForum = function () {
            if (!vm.post.title) {
                vm.post.titleInvalid = true;
                return;
            }
            if (!vm.post.description) {
                vm.post.descrpitionInvalid = true;
                return;
            }
            vm.post.titleInvalid = false;
            vm.post.descrpitionInvalid = false;
            util.hideAllPopups();

            var request = {
                entry: {
                    fields: {
                        title: { "en-US": vm.post.title },
                        description: { "en-US": vm.post.description },
                        tags: { "en-US": vm.post.tags },
                        author: { "en-US": $scope.userInfo.username },
                        authorId: { "en-US": $scope.userInfo.id }
                    }
                }
            }

            if (vm.post.includeCSV) {
                request.attachments = [];
                var csvData = getCsvData();
                var base64 = util.getCsvBase64Data(csvData.headers, csvData.data);
                request.attachments.push({
                    base64Content: base64,
                    name: config.CSV_FILE_NAMES.ALERT_DETAILS,
                    type: 'text/csv'
                });
            }

            var imgWidth = 900;
            if (vm.post.includeChart) {
                // calculate image dimensions
                var lineChartWidth = $('.main-import').width() - 17;
                var lineChartHeight = 359;
                var imgHeight = Math.max(250, lineChartHeight * imgWidth / lineChartWidth);

                util.svgToPng('#tradeDataLineChart', imgWidth, imgHeight, 'lineChart.css', function (png) {
                    request.graphic = {
                        base64Content: png,
                        name: 'data-comparison-chart.png',
                        type: 'image/png'
                    };
                });
            }

            util.withTimeout(function () {
                if (vm.post.includeMap) {
                    // calculate image dimensions
                    var imgHeight = imgWidth * 0.65;
                    util.svgToPng('#dataComparisonMap', imgWidth, imgHeight, null, function (png) {
                        request.map = {
                            base64Content: png,
                            name: 'data-comparison-map.png',
                            type: 'image/png'
                        };
                    });
                }

                util.withTimeout(function () {
                    ContentfulService.createPost(request).then(function () {
                        util.showMessage(vm, 'Success', 'Post published to the forum!');
                    }, util.handleHttpError);
                }, 1200);
            }, 1100);
        };

        vm.downloadPdf = function (svgContainerId) {
            var svg = $('svg', $(svgContainerId));
            var pdfContainer = $('.map-export-pdf', $(svgContainerId).parent());
            if (!svg.length) {
                return;
            }

            // get image dimensions
            var imgWidth = svg.width();
            var imgHeight = svg.height();

            util.svgToPng(svgContainerId, imgWidth, imgHeight, 'lineChart.css', function (png) {
                var pngData = 'data:image/png;base64,' + png;
                var doc = new jsPDF("landscape", "mm", "a3");
                var width = doc.internal.pageSize.width;
                var height = doc.internal.pageSize.height;

                var ratio = imgWidth / width;
             
                if(pdfContainer.length > 0){
                    pdfContainer.find('img').attr('src', pngData);
                    pdfContainer.css("position", "relative"); 
                    util.customizePdfSize(pdfContainer);
                    doc.setFillColor(255, 255, 255);
                    doc.addHTML(pdfContainer[0], 0, 0, {pagesplit: true}, function(){
                    pdfContainer.css("position", "absolute");
                    util.resetPdfSize(pdfContainer);
                     doc.save(svgContainerId.substring(1) + '.pdf');
                    });
                }else{
                    doc.addImage(pngData, 'PNG', 0, 0, width, imgHeight / ratio);
                    doc.save(svgContainerId.substring(1) + '.pdf');
                }
            });
        };

        vm.downloadCsv = function () {
            var csvData = getCsvData();
            util.exportToCsv(csvData.headers, csvData.data, config.CSV_FILE_NAMES.DATA_COMPARISON);
        };

        function getCsvData() {
            var result = {};
            result.headers = ['Year', 'Commodity Name', 'Importer', 'Importer netweightKg', 'Importer tradeValueUSD',
                'Exporter', 'Exporter netweightKg', 'Exporter tradeValueUSD', 'Diff in netweightKg', 'Diff in tradeValueUSD'];

            var data = [];
            var items = $filter('orderBy')($scope.tradeData, $scope.sortType, $scope.sortReverse);
            for (var index in items) {
                var item = items[index];
                if(item.importedVolumeDisplayValue === '-' || item.exportedVolumeDisplayValue === '-'){
                     item.volumeDiff = '-';
                }
                if(item.importedValueDisplayValue === '-' || item.exportedValueDisplayValue === '-'){ 
                    item.valueDiff = '-';
                }               
                data.push([
                    item.year,
                    escapeCsv(item.commodityName),
                    escapeCsv(item.importer),
                    item.importedVolumeDisplayValue,
                    item.importedValueDisplayValue,
                    escapeCsv(item.exporter),
                    item.exportedVolumeDisplayValue,
                    item.exportedValueDisplayValue,
                    item.volumeDiff,
                    item.valueDiff
                ]);
            }

            result.data = data;
            return result;
        };

        function escapeCsv(value) {
            return '"' + value + '"';
        };

        vm.removePostTag = function (tag) {
            var index = vm.post.tags.indexOf(tag);
            vm.post.tags.splice(index, 1);
        };

        vm.getAllTags = function () {
            var tags = getCountryTags($scope.query.exporterCountryCodes);

            var importersTags = getCountryTags($scope.query.importerCountryCodes);
            for (var index in importersTags) {
             if (tags.indexOf(importersTags[index]) == -1) {//add only new countries
                 tags.push(importersTags[index]);
             }   
            }

            for (var index in $scope.query.commodityCodes) {
                var id = $scope.query.commodityCodes[index];
                var item = vm.getCommodityById(id);
                var name = item.name;//util.trimLeft(item.name, ' -0123456789');
                tags.push(util.trimLength(name, 50));
            }

            return tags;
        };

        function getCountryTags(countryCodes) {
            var tags = [];
            for (var index in countryCodes) {
                var code = countryCodes[index];
                var country = vm.getCountryByCode(code);
                var name = util.trimLeft(country.fullName, ' -0123456789');
                tags.push(util.trimLength(name, 50));
            }
            return tags;
        }

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
            var items = $filter('filter')($scope.countries, { code: Number(code) }, true);
            return items.length ? items[0] : null;
        };

        function getDisplayValue(value) {
            return value !== null ? value : '-';
        };

        function reload() {
            if (!util.validateSearchQuery($scope.query)) {
                return;
            };

            vm.post.tags = vm.getAllTags();
            tradeDataService.search($scope.query).then(function (result) {
                if (!result.length) {
                    util.showMessage(vm, 'Warning!', "Trading data wasn't found for given parameters.");
                }
                
                var importers = {};
                var exporters = {};
                var totalImportedValues = [];
                var totalExportedValues = [];
                var totalImportedVolumes = [];
                var totalExportedVolumes = [];
                var totalVolumeDifferences = [];
                var totalValueDifferences = [];
                $scope.tradeData = result;
                for (var index in $scope.tradeData) {
                    var item = $scope.tradeData[index];
                    item.commodityName = vm.getCommodityById(item.commodityId).name;
                    item.importer = vm.getCountryByCode(item.importerCountryCode).fullName;
                    item.exporter = vm.getCountryByCode(item.exporterCountryCode).fullName;
                    item.exportedVolumeDisplayValue = getDisplayValue(item.exportedVolume);
                    item.exportedValueDisplayValue = getDisplayValue(item.exportedValue);
                    item.importedVolumeDisplayValue = getDisplayValue(item.importedVolume);
                    item.importedValueDisplayValue = getDisplayValue(item.importedValue);
                    item.volumeDiff = item.importedVolume - item.exportedVolume;
                    item.valueDiff = item.importedValue - item.exportedValue;
                    var importAmount = isTradeByVolume() ? item.importedVolume : item.importedValue;
                    var exportAmount = isTradeByVolume() ? item.exportedVolume : item.exportedValue;
                    // aggregate importers

                     // Remove country code from full name
                    if(item.exporterCountryCode && item.exporter.indexOf(item.exporterCountryCode) > -1 )
                    {
                        item.exporter = item.exporter.split("-")[1].trim();
                    }
                    if(item.importerCountryCode && item.importer.indexOf(item.importerCountryCode) > -1 )
                    {
                        item.importer = item.importer.split("-")[1].trim();
                    }

                    if (!importers[item.importer]  && item.year === $scope.sliderYear) {
                        importers[item.importer] = "-";
                    }
                    if (item.year === $scope.sliderYear && importAmount !== null) {
                        if (isNaN(importers[item.importer])) {
                            importers[item.importer] = 0;
                        }
                        importers[item.importer] += importAmount;
                    }   
                    // aggregate exporters



                    if (!exporters[item.exporter] && item.year === $scope.sliderYear) {
                        exporters[item.exporter] = "-";
                    }
                    if (item.year === $scope.sliderYear && exportAmount !== null) {
                        if (isNaN(exporters[item.exporter])) {
                            exporters[item.exporter] = 0;
                        }
                        exporters[item.exporter] += exportAmount;
                    }

                    // update aggregated values
                    if (item.importedValue) {
                        totalImportedValues.push(item.importedValue);
                    }
                    if (item.exportedValue) {
                        totalExportedValues.push(item.exportedValue);
                    }
                    if (item.importedVolume) {
                        totalImportedVolumes.push(item.importedVolume);
                    }
                    if (item.exportedVolume) {
                        totalExportedVolumes.push(item.exportedVolume);
                    }
                    if (item.importedVolume || item.exportedVolume) {
                        totalVolumeDifferences.push(Math.abs(item.volumeDiff));
                    }
                    if (item.importedValue || item.exportedValue) {
                        totalValueDifferences.push(Math.abs(item.valueDiff));
                    }
                }

                var weightTreshold = $scope.userInfo.weightDiscrepancyThreshold;
                var volumeThreshold = $scope.userInfo.volumeChangesThreshold;
                for (var index in $scope.tradeData) {
                    // check weight discrepancy
                    var item = $scope.tradeData[index];
                    if (weightTreshold && item.importedValue && item.exportedValue) {
                        if (item.exportedValue * weightTreshold / 100 <= item.importedValue) {
                            item.hasWeightAlert = true;
                        }
                    }

                    // check weight discrepancy
                    if (volumeThreshold && item.importedVolume && item.exportedVolume) {
                        if (item.exportedVolume * volumeThreshold / 100 <= item.importedVolume) {
                            item.hasVolumeAlert = true;
                        }
                    }
                }

                // update key findings
                $scope.keyFindings = [];
                addKeyFindings('Import Summary', totalImportedVolumes, totalImportedValues);
                addKeyFindings('Export Summary', totalExportedVolumes, totalExportedValues);
                addKeyFindings('Discrepancy Summary', totalVolumeDifferences, totalValueDifferences);

                $scope.chartData = {
                    query: $scope.query,
                    tradeData: $scope.tradeData
                };

                //Add EU countries to the map
                if(importers['EU-27'])
                {
                    _.forEach(getEUCountries(), function(euCountry) {
                        importers[euCountry] = importers['EU-27'];
                    });
                }
                if(exporters['EU-27'])
                {
                    _.forEach(getEUCountries(), function(euCountry) {
                        exporters[euCountry] = exporters['EU-27'];
                    });
                }

                $scope.mapData = {
                    importers: importers,
                    exporters: exporters,
                    tradeBy: $scope.query.tradeBy
                };


                redrawGraphics();
            }, util.handleHttpError);
        };

        function redrawGraphics(resizeOnly) {
            // draw chart
            var yAxisLabel = isTradeByVolume() ? "net weight, kg" : "trade value, USD";
            if (resizeOnly) {
                if($scope.chartSettings) {
                util.updateChartData($scope.chartSettings, '#tradeDataLineChart', yAxisLabel);
                }
                else{//the user resized screen before data is retrieved 
                    //do nothing
                }
            }
            else {
                $scope.chartSettings = util.drawTradeDataLineChart('#tradeDataLineChart', $scope.chartData.query, $scope.chartData.tradeData, function (chartLegend) {
                    $scope.chartLegend = chartLegend;
                }, yAxisLabel);
            }

            // draw map
            if ($scope.mapData) {
            util.drawMap($scope.mapData.importers, $scope.mapData.exporters, $scope.mapData.tradeBy, 'dataComparisonMap',true);
            }
        };

        function addKeyFindings(title, weights, values) {
            var totalWeight = getSum(weights);
            var totalValue = getSum(values);
            $scope.keyFindings.push({
                title: title,
                totalWeight: totalWeight,
                totalValue: totalValue,
                averageWeight: totalWeight / weights.length,
                averageValue: totalValue / values.length
            });
        };

        function getSum(numbers) {
            var result = 0;
            for (var index in numbers) {
                result += numbers[index];
            }
            return result;
        };

        function isTradeByVolume() {
            return $scope.query.tradeBy === 'volume';
        }

        // initialize
        init();
    }
})();

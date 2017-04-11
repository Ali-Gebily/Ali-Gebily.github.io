/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for alert details page.
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
        .module('app.alertdetail')
        .controller('AlertDetailController', AlertDetailController);

    AlertDetailController.$inject = ['$scope', '$state', '$stateParams', '$q', '$filter', '$window', 'config', 'currentUser', 'util', 'tradeDataService', 'alertService', 'ContentfulService'];
    /* @ngInject */
    function AlertDetailController($scope, $state, $stateParams, $q, $filter, $window, config, currentUser, util, tradeDataService, alertService, ContentfulService) {
        var vm = this;
        vm.post = {
            includeChart: true,
            includeMap: true
        };

        util.scrollToTop();

        if (!$stateParams.alert) {
            $state.go('alertsearch');
            return;
        }

        vm.alert = $stateParams.alert;
        vm.yearAlertTypes = {};
        vm.sliderYear = '';

        function init() {
            $scope.userInfo = currentUser.userInfo;
            vm.title = 'Alert Detail';
            if (!$scope.userInfo.isLoggedIn) {
                util.login().then(function(res) {
                    if (!$scope.userInfo.isLoggedIn) {
                        $state.go('alertsearch');
                    }
                });
            }
            vm.login = util.login;
            vm.activeTab = 'chart';
            vm.query = {
                tradeBy: 'volume',
                yearStart: config.PERIOD_YEARS[0],
                yearEnd: config.PERIOD_YEARS[config.PERIOD_YEARS.length - 1],
                importerCountryCodes: [vm.alert.importerCode],
                exporterCountryCodes: [vm.alert.exporterCode],
                commodityCodes: [vm.alert.commodityCode],
            };

            // load alert threshold values
            alertService.getThreshold().then(function (data) {
                vm.volumeDiscrepancyThreshold = data.netWeightLevelPercentage;
                vm.volumeChangesThreshold = data.volumeLevelPercentage;
            }, util.handleHttpError);

            $q.all([
                tradeDataService.getAllCommodities(),
                tradeDataService.getAllCountries()]).then(function (data) {
                    // commodities
                    vm.commodoties = data[0];

                    // countries
                    vm.countries = data[1];

                    // load query data
                    vm.reload();
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
            w.unbind("resize", resizeHandler);
            });
        };

        vm.reload = function () {
            tradeDataService.search(vm.query).then(function (result) {
                var importers = {};
                importers[vm.alert.importerName] = '-';
                var exporters = {};
                exporters[vm.alert.exporterName] = '-';

                vm.tradeData = result;
                for (var index in vm.tradeData) {
                    var item = vm.tradeData[index];
                    item.commodityName = vm.getCommodityById(item.commodityId).name;
                    item.importer = vm.getCountryByCode(item.importerCountryCode).fullName;
                    item.exporter = vm.getCountryByCode(item.exporterCountryCode).fullName;
                    item.exportedVolumeDisplayValue = getDisplayValue(item.exportedVolume);
                    item.exportedValueDisplayValue = getDisplayValue(item.exportedValue);
                    item.importedVolumeDisplayValue = getDisplayValue(item.importedVolume);
                    item.importedValueDisplayValue = getDisplayValue(item.importedValue);
                    item.volumeDiff = item.importedVolume - item.exportedVolume;
                    item.valueDiff = item.importedValue - item.exportedValue;
                    if (item.commodityName !== null && item.commodityName.lastIndexOf(':') > 0) {
                        item.commodityName = item.commodityName.substring(0, item.commodityName.lastIndexOf(':') + 1) + '<strong>' + item.commodityName.substring(item.commodityName.lastIndexOf(':') + 1) + '</strong>';
                    }
                    // aggregate importer/exporter total volume
                    //var item = vm.tradeData[index];
                    if(item.year == vm.sliderYear) {
                        importers[vm.alert.importerName] = item.importedVolume;
                        exporters[vm.alert.exporterName] = item.exportedVolume;
                    }
                }

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
                    exporters: exporters
                };
                vm.post.tags = [
                    util.trimLength(vm.getCommodityById(vm.query.commodityCodes[0]).name, 250),
                    vm.getCountryByCode(vm.query.importerCountryCodes[0]).fullName,
                    vm.getCountryByCode(vm.query.exporterCountryCodes[0]).fullName
                ];
                redrawGraphics();
            }, util.handleHttpError);

            var alertCriteria = {
                exporterCode: vm.alert.exporterCode,
                importerCode: vm.alert.importerCode,
                commodityCode: vm.alert.commodityCode
            };
            alertService.search(alertCriteria).then(function (result) {
                vm.yearAlertTypes = {};
                for (var index in result.items) {
                    var alert = result.items[index];
                    vm.yearAlertTypes[alert.year] = {
                        importExport: alert.hasImportExportAlert,
                        volumeChanges: alert.hasVolumeChangesAlert,
                        both: alert.hasImportExportAlert && alert.hasVolumeChangesAlert
                    };
                }
            }, util.handleHttpError);
        };

        function redrawGraphics(resizeOnly) {
            // draw chart
            if (resizeOnly) {
                if ($scope.chartSettings) {
                util.updateChartData($scope.chartSettings, '#alertDetailsLineChart');
                }
            }
            else {
                $scope.chartSettings = util.drawTradeDataLineChart('#alertDetailsLineChart', vm.query, vm.tradeData, function (chartLegend) {
                    vm.chartLegend = [{
                        name: vm.alert.exporterName + ' exports to ' + vm.alert.importerName + ' (net weight kg)'
                    }, {
                            name: vm.alert.importerName + ' imports from ' + vm.alert.exporterName + ' (net weight kg)'
                        }];

                    if (chartLegend[0].name === vm.alert.exporterCode) {
                        vm.chartLegend[0].style = chartLegend[1].style;
                        vm.chartLegend[1].style = chartLegend[0].style;
                    }
                    else {
                        vm.chartLegend[0].style = chartLegend[0].style;
                        vm.chartLegend[1].style = chartLegend[1].style;
                    }
                });
            }

            // draw map
            if ($scope.mapData) {
            util.drawMap($scope.mapData.importers, $scope.mapData.exporters, 'volume', 'alertDetailsMap', true);
            }
        };

        vm.setActiveTab = function(tab) {
            vm.activeTab=tab;
            util.withTimeout(function () {
                util.arrangeMarkers();
            }, 50);
            
        }

        vm.getCommodityById = function (id) {
            if (!vm.commodoties) {
                return null;
            }
            var items = $filter('filter')(vm.commodoties, {
                id: id.trim()
            }, true);
            return items.length ? items[0] : null;
        };

        vm.getCountryByCode = function (code) {
            if (!vm.countries) {
                return null;
            }
            var items = $filter('filter')(vm.countries, { code: Number(code) }, true);
            return items.length ? items[0] : null;
        };

        function getDisplayValue(value) {
            return value !== null ? value : '-';
        };

        vm.removePostTag = function (tag) {
            var index = vm.post.tags.indexOf(tag);
            vm.post.tags.splice(index, 1);
        };

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

                util.svgToPng('#alertDetailsLineChart', imgWidth, imgHeight, 'lineChart.css', function (png) {
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
                    util.svgToPng('#alertDetailsMap', imgWidth, imgHeight, null, function (png) {
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

                if (pdfContainer.length > 0) {
                    pdfContainer.find('img').attr('src', pngData);
                    pdfContainer.css("position", "relative");
                    util.customizePdfSize(pdfContainer);
                    doc.setFillColor(255, 255, 255);
                    doc.addHTML(pdfContainer[0], 0, 0, { pagesplit: true }, function () {
                    pdfContainer.css("position", "absolute");
                    util.resetPdfSize(pdfContainer);
                     doc.save(svgContainerId.substring(1) + '.pdf');
                    });
                } else {
                    doc.addImage(pngData, 'PNG', 0, 0, width, imgHeight / ratio);
                    doc.save(svgContainerId.substring(1) + '.pdf');
                }
            });
        };

        $scope.updateMap = function (yearValue) {            
            vm.sliderYear = yearValue;
            if(vm.tradeData)
            {
                var importers = {};
                var exporters = {};

                var yearData = _.filter(vm.tradeData, function(o) { return o.year === vm.sliderYear; });
                 for (var index in yearData) {
                    var item = yearData[index];                 
                    importers[item.importer] =  item.importedVolumeDisplayValue ;
                    exporters[item.exporter] = item.exportedVolumeDisplayValue ;
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
                    exporters: exporters                    
                };
                // draw map
                util.drawMap($scope.mapData.importers, $scope.mapData.exporters, 'volume', 'alertDetailsMap', true);
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

        vm.downloadCsv = function () {
            var csvData = getCsvData();
            util.exportToCsv(csvData.headers, csvData.data, config.CSV_FILE_NAMES.ALERT_DETAILS);
        };

        function getCsvData() {
            var result = {};
            result.headers = ['Year', 'Commodity Name', 'Importer', 'Importer netweightKg', 'Importer tradeValueUSD',
                'Exporter', 'Exporter netweightKg', 'Exporter tradeValueUSD', 'Diff in netweightKg', 'Diff in tradeValueUSD'];

            var data = [];
            var items = $filter('orderBy')(vm.tradeData, $scope.sortType, $scope.sortReverse);
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

        init();
    }
})();

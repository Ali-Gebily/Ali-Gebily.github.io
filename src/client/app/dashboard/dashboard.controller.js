/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for dashboard page.
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
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$state', '$http', '$q', '$filter', 'DashboardService', 'logger', 'currentUser', 'util', 'config', 'dashboardService', 'dataservice'];

    /* @ngInject */
    function DashboardController($scope, $state, $http, $q, $filter, DashboardService, logger, currentUser, util, config, dashboardService, dataService) {
        $scope.userInfo = currentUser.userInfo;

        var vm = this;
        vm.titles = config.DASHBOARD_TITLES;
        var baseFeedUrl = 'https://news.google.de/news/feeds?pz=1&cf=all&ned=de&hl=en&output=rss&q=';
        var leadingExportersCriteria = {
            displayType: 'weight',
            children: 'tradingPartners',
            numberOfChildren: 5,
            pageNumber: 1,
            pageSize: 10,
            sortBy: 'TotalWeight',
            sortType: 'Descending'
        };
        var leadingImportersCriteria = leadingExportersCriteria;
        var leadingCommodityImportersCriteria = {
            displayType: 'value',
            children: 'commodities',
            numberOfChildren: 10,
            pageNumber: 1,
            pageSize: 10,
            sortBy: 'TotalValue',
            sortType: 'Descending'
        };

        function init() {
            $scope.selectedNewsTopic = 'IUU fishing, illegal fishing';
            $scope.news = {
                items: []
            };

            vm.title = 'Dashboard';
            vm.yearsRange = config.PERIOD_YEARS;
            vm.dashboardYear = config.DASHBOARD_YEAR;
            vm.news = {
                title: 'WWF',
                description: 'WWF SPA App to detect fish illegal fish trade'
            };

            vm.searchQuery = {
                species: '',
                tradeFlow: '',
                reportingCountry: '',
                partCountry: '',
                periods: ''
            };

            vm.leadingExporters = {
                tab: 'exporters',
                data: {},
                selectedYear: vm.yearsRange[vm.yearsRange.length - 1]
            };

            vm.leadingImporters = {
                tab: 'importers',
                data: {},
                selectedYear: vm.yearsRange[vm.yearsRange.length - 1]
            };

            vm.leadingCommodityImporters = {
                tab: 'importers',
                data: {},
                selectedYear: vm.yearsRange[vm.yearsRange.length - 1]
            };

            vm.topDollarPerKgCommodities = {
                tab: 'overall',
                data: {},
                selectedYear: vm.yearsRange[vm.yearsRange.length - 1],
                topCount: 10,
                tradeFlow: 1 // import
            };

            vm.topOverallValueCommodities = {
                data: {},
                topCount: 20,
                tradeFlow: 2 // export
            };

            activate();
            loadData();
        };

        vm.reloadFromVertica = function () {
            showMessage('Information', 'Reloading from Vertica may take up to few minutes. Once completed notification will be displayed.');
            dashboardService.reloadFromVertica(config.DASHBOARD_YEAR).then(function () {
                showMessage('Information', 'Data successfully reloaded from Vertica.');
                loadData();
            }, function () {
                showMessage('Error', 'Failed to load data from Vertica. Check server logs for more details.');
            });
        };

        vm.downloadPdf = function (svgContainerId) {
            var svg = $('svg', $(svgContainerId));
            var pdfContainer = $('.map-export-pdf', $(svgContainerId).parent());
            if (!svg.length) {
                return;
            }

            // calculate image dimensions

            var imgWidth = svg.width();
            var imgHeight = svg.height();

            util.svgToPng(svgContainerId, imgWidth, imgHeight, 'barHorizontalChart.css', function (png) {
                var pngData = 'data:image/png;base64,' + png;

                var doc = new jsPDF("landscape", "mm", "a3");
                var width = doc.internal.pageSize.width;
                var height = doc.internal.pageSize.height;
                
                var ratio = imgWidth / width;
             
                if (pdfContainer.length > 0) {
                    pdfContainer.find('img').attr('src', pngData);  
                    util.customizePdfSize(pdfContainer);
                    doc.setFillColor(255, 255, 255);
                    doc.addHTML(pdfContainer[0], 0, 0, { pagesplit: true }, function () { 
                    util.resetPdfSize(pdfContainer);
                     doc.save(svgContainerId.substring(1) + '.pdf');
                    });
                } else {
                    doc.addImage(pngData, 'PNG', 0, 0, width, imgHeight / ratio);
                    doc.save(svgContainerId.substring(1) + '.pdf');
                }
            });
        };

        vm.getCountryName = function (entries, prop) {
            if (entries && entries.length) {
                return entries.map(function (e) {
                    return e[prop || 'name'];
                });
            }
            return [];
        }

        vm.getCommodityCode = function (name) { 
            return name.substr(0, name.indexOf('-'));
        }

        vm.downloadLeadingExporters = function () {
            var headers = ['Country', 'Exported netweightKg'];

            var data = [];
            for (var index in vm.leadingExporters.data) {
                var item = vm.leadingExporters.data[index];
                data.push([
                    escapeCsv(item.countryName),
                    item.totalWeight
                ]);
            }

            util.exportToCsv(headers, data, config.CSV_FILE_NAMES.LEADING_EXPORTERS_BY_WEIGHT);
        };

        vm.downloadLeadingExporterPartners = function () {
            var headers = ['Exporter', 'Partner', 'Year', 'Exported netweightKg'];

            var data = [];
            var exporter = vm.leadingExporters.selectedExporter;
            if (!exporter) {
                showMessage('Notification', 'Please select exporter to download CSV data.');
                return;
            }

            for (var year in exporter.children) {
                var items = exporter.children[year];
                for (var index in items) {
                    var item = items[index];
                    data.push([
                        escapeCsv(exporter.countryName),
                        escapeCsv(item.name),
                        year,
                        item.value
                    ]);
                }
            }

            var fileNameTemplate = config.CSV_FILE_NAMES.LEADING_EXPORTERS_BY_WEIGHT_AND_PARTNERS;
            var fileName = fileNameTemplate.replace('<countryname>', exporter.countryName);
            util.exportToCsv(headers, data, fileName);
        };

        vm.downloadLeadingImporters = function () {
            var headers = ['Country', 'Imported netweightKg'];

            var data = [];
            for (var index in vm.leadingImporters.data) {
                var item = vm.leadingImporters.data[index];
                data.push([
                    escapeCsv(item.countryName),
                    item.totalWeight
                ]);
            }

            util.exportToCsv(headers, data, config.CSV_FILE_NAMES.LEADING_IMPORTERS_BY_WEIGHT);
        };

        vm.downloadLeadingImporterPartners = function () {
            var headers = ['Importer', 'Partner', 'Year', 'Imported netweightKg'];

            var data = [];
            var importer = vm.leadingImporters.selectedImporter;
            if (!importer) {
                showMessage('Notification', 'Please select importer to download CSV data.');
                return;
            }

            for (var year in importer.children) {
                var items = importer.children[year];
                for (var index in items) {
                    var item = items[index];
                    data.push([
                        escapeCsv(importer.countryName),
                        escapeCsv(item.name),
                        year,
                        item.value
                    ]);
                }
            }

            var fileNameTemplate = config.CSV_FILE_NAMES.LEADING_IMPORTERS_BY_WEIGHT_AND_PARTNERS;
            var fileName = fileNameTemplate.replace('<countryname>', importer.countryName);
            util.exportToCsv(headers, data, fileName);
        };

        vm.downloadLeadingCommodityImporters = function () {
            var headers = ['Country', 'Imported tradeValueUSD'];

            var data = [];
            for (var index in vm.leadingCommodityImporters.data) {
                var item = vm.leadingCommodityImporters.data[index];
                data.push([
                    escapeCsv(item.countryName),
                    item.totalValue
                ]);
            }

            util.exportToCsv(headers, data, config.CSV_FILE_NAMES.LEADING_IMPORTERS_BY_VALUE);
        };

        vm.downloadLeadingCommodityImportersCommodities = function () {
            var headers = ['Importer', 'Commodity', 'Year', 'Imported tradeValueUSD'];

            var data = [];
            var importer = vm.leadingCommodityImporters.selectedImporter;
            if (!importer) {
                showMessage('Notification', 'Please select importer to download CSV data.');
                return;
            }

            for (var year in importer.children) {
                var items = importer.children[year];
                for (var index in items) {
                    var item = items[index];
                    data.push([
                        escapeCsv(importer.countryName),
                        escapeCsv(item.name),
                        year,
                        item.value
                    ]);
                }
            }

            var fileNameTemplate = config.CSV_FILE_NAMES.LEADING_IMPORTERS_BY_VALUE_AND_COMMODITIES;
            var fileName = fileNameTemplate.replace('<countryname>', importer.countryName);
            util.exportToCsv(headers, data, fileName);
        };

        vm.downloadTopDollarPerKgCommoditiesOverall = function () {
            var headers = ['Commodity', 'USD per kg'];

            var data = [];
            var criteria = {
                year: 0
            };
            var yearlyData = $filter('filter')(vm.topDollarPerKgCommodities.data, criteria, true);
            for (var index in yearlyData) {
                var item = yearlyData[index];
                data.push([
                    escapeCsv(item.commodityName),
                    item.dollarsPerKilo
                ]);
            }

            util.exportToCsv(headers, data, config.CSV_FILE_NAMES.TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_OVERALL);
        };

        vm.downloadTopDollarPerKgCommoditiesYearly = function () {
            var headers = ['Year', 'Commodity', 'USD per kg'];

            var data = [];
            var items = vm.topDollarPerKgCommodities.data;
            for (var index in items) {
                var item = items[index];
                if (item.year) {
                    data.push([
                        item.year,
                        escapeCsv(item.commodityName),
                        item.dollarsPerKilo
                    ]);
                }
            }

            util.exportToCsv(headers, data, config.CSV_FILE_NAMES.TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_BY_YEAR);
        };

        vm.downloadTopOverallValueCommodities = function () {
            var headers = ['Commodity', 'Exported tradeValueUSD'];

            var data = [];
            var items = vm.topOverallValueCommodities.data;
            for (var index in items) {
                var item = items[index];
                data.push([
                    escapeCsv(item.commodityName),
                    item.totalValue
                ]);
            }

            util.exportToCsv(headers, data, config.CSV_FILE_NAMES.TOP_COMMODITIES_BY_IMPORT_TRADING_VALUE_SUM);
        };

        function escapeCsv(value) {
            return '"' + value + '"';
        };

        vm.updateExporterPartners = function () {
            var exporter = vm.leadingExporters.selectedExporter;
            if (!exporter) {
                return;
            }

            var importers = {};
            var exporters = {};
            exporters[exporter.countryName] = exporter.totalWeight;

            var yearlyData = exporter.children[vm.leadingExporters.selectedYear];
            for (var index in yearlyData) {
                var partner = yearlyData[index];
                if(partner.name === exporter.countryName){
                    exporters[exporter.countryName] = partner.value;                    
                }
                else{
                    importers[partner.name] = partner.value;
                }
            }

            fixMapCountries(importers);
            fixMapCountries(exporters);

            // draw map
            util.drawMap(importers, exporters, 'volume', 'exporterPartnersMap', false);
        };

        vm.updateImporterPartners = function () {
            var importer = vm.leadingImporters.selectedImporter;
            if (!importer) {
                return;
            }

            var exporters = {};
            var importers = {};
            importers[importer.countryName] = importer.totalWeight;

            var yearlyData = importer.children[vm.leadingImporters.selectedYear];
            for (var index in yearlyData) {
                var partner = yearlyData[index];
                if(partner.name === importer.countryName){
                    importers[importer.countryName] = partner.value;
                }
                else{                    
                    exporters[partner.name] = partner.value;
                }
            }

            fixMapCountries(importers);
            fixMapCountries(exporters);

            // draw map
            util.drawMap(importers, exporters, 'volume', 'importerPartnersMap', false);
        };

        vm.updateCommodityImporters = function () {
            var importer = vm.leadingCommodityImporters.selectedImporter;
            if (!importer) {
                return;
            }

            var commodities = [];
            var yearlyData = importer.children[vm.leadingCommodityImporters.selectedYear];
            for (var index in yearlyData) {
                var commodity = yearlyData[index];
                commodities.push([commodity.name, commodity.value]);
            }

            // draw chart
            $('#importerCommoditiesBarChart svg').remove();
            drawBarChart(commodities, null, 'importerCommoditiesBarChart', '$ ', null, 30);
        };

        vm.updateDollarPerKgCommodities = function () {
            var year = vm.topDollarPerKgCommodities.tab === 'yearly'
                ? vm.topDollarPerKgCommodities.selectedYear
                : 0;

            var commodities = [];
            var yearlyData = $filter('filter')(vm.topDollarPerKgCommodities.data, { year: year }, true);
            for (var index in yearlyData) {
                var item = yearlyData[index];
                commodities.push([item.commodityName, item.dollarsPerKilo]);
            }

            // draw chart
            $('#dollarPerKgCommoditiesBarChart svg').remove();
            drawBarChart(commodities, null, 'dollarPerKgCommoditiesBarChart', '$ ', ' / kg');
            vm.topDollarPerKgCommoditiesYearly = yearlyData;
        };

        function fixMapCountries(countries) {
            function addCountry(name, value) {
                if (!countries[name]) {
                    countries[name] = value;
                }
            };

            for (var countryName in countries) {
                if (countryName === 'EU-27') {
                    var val = countries[countryName];
                    delete countries[countryName];
                    addCountry('Austria', val);
                    addCountry('Belgium', val);
                    addCountry('Bulgaria', val);
                    addCountry('Croatia', val);
                    addCountry('Republic of Cyprus', val);
                    addCountry('Czech Republic', val);
                    addCountry('Denmark', val);
                    addCountry('Estonia', val);
                    addCountry('Finland', val);
                    addCountry('France', val);
                    addCountry('Germany', val);
                    addCountry('Greece', val);
                    addCountry('Hungary', val);
                    addCountry('Ireland', val);
                    addCountry('Italy', val);
                    addCountry('Latvia', val);
                    addCountry('Lithuania', val);
                    addCountry('Luxembourg', val);
                    addCountry('Netherlands', val);
                    addCountry('Poland', val);
                    addCountry('Portugal', val);
                    addCountry('Romania', val);
                    addCountry('Slovakia', val);
                    addCountry('Slovenia', val);
                    addCountry('Spain', val);
                    addCountry('Sweden', val);
                }
            }
        };

        function loadData() {
            loadLeadingExporters();
            loadLeadingImporters();
            loadLeadingCommodityImporters();
            loadTopDollarPerKgCommodities();
            loadTopOverallValueCommodities();
        };
        
        function loadLeadingExporters() {
            dashboardService.getExporters(leadingExportersCriteria).then(function (data) {
                vm.leadingExporters.data = data.items;
                util.stylizeSelectBox('#SelectBoxLeadingExporters', 'Select Exporter');
                drawLeadingCountries(vm.leadingExporters.data, true, 'exportersBarChart');
            }, util.handleHttpError);
        };

        function loadLeadingImporters() {
            dashboardService.getImporters(leadingImportersCriteria).then(function (data) {
                vm.leadingImporters.data = data.items;
                util.stylizeSelectBox('#SelectBoxLeadingImporters', 'Select Importer');
                drawLeadingCountries(vm.leadingImporters.data, true, 'importersBarChart');
            }, util.handleHttpError);
        };

        function loadLeadingCommodityImporters() {
            dashboardService.getImporters(leadingCommodityImportersCriteria).then(function (data) {
                vm.leadingCommodityImporters.data = data.items;
                util.stylizeSelectBox('#SelectBoxLeadingCommodityImporters', 'Select Importer');
                drawLeadingCountries(vm.leadingCommodityImporters.data, false, 'commodityImportersBarChart');
            }, util.handleHttpError);
        };

        function loadTopDollarPerKgCommodities() {
            var params = {
                count: vm.topDollarPerKgCommodities.topCount               
            };
            dashboardService.getTopValuePerKgCommodities(params).then(function (data) {
                vm.topDollarPerKgCommodities.data = data;
                vm.updateDollarPerKgCommodities();
            }, util.handleHttpError);
        };

        function loadTopOverallValueCommodities() {
            var params = {
                count: vm.topOverallValueCommodities.topCount,
                tradeFlow: vm.topOverallValueCommodities.tradeFlow
            };
            dashboardService.getTopOverallValueCommodities(params).then(function (data) {
                var commodities = [];
                vm.topOverallValueCommodities.data = [];
                for (var index in data) {
                    var item = data[index];
                    commodities.push([item.commodityName, item.totalValue]);
                    vm.topOverallValueCommodities.data.push({
                        commodityName: item.commodityName,
                        totalValue: item.totalValue
                    });
                }

                // draw chart
                drawBarChart(commodities, null, 'topOverallValueCommodities', '$ ');
            }, util.handleHttpError);
        };

        function drawLeadingCountries(data, isByWeight, chartId) {
            var dataCountry = [];
            var flags = [];
            for (var index in data) {
                var exporter = data[index];
                dataCountry.push([exporter.countryName, isByWeight ? exporter.totalWeight : exporter.totalValue]);
                flags.push('images/flags/' + exporter.countryName + '.png');
            }

            var prefix, suffix;
            if (isByWeight) {
                suffix = ' kg';
            }
            else {
                prefix = '$ ';
            }
            drawBarChart(dataCountry, flags, chartId, prefix, suffix);
        };

        // - - - Chart helpers - - -
        function drawBarChart(dataBarHozChart, arrayOfPics, chartId, valuePrefix, valueSuffix, offset) {
            var leftBarText = 5;
            var leftOpera = -2;
            if (!offset) {
                offset = 0;
            }

            var max;
            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (isChrome) {
                leftOpera = 3;
            }
            
            if(!document.getElementById(chartId) || document.getElementById(chartId) === null){
                return;
            }
            
            var barHozChart = document.getElementById(chartId);
            var labelLimit = 50;
            var axisMargin = 0;
            var marginBarHozChart = 30;
            var valueMargin = 4;
            var width = barHozChart.offsetWidth;
            var height = barHozChart.offsetHeight - offset;
            var barHeight = (height - axisMargin - marginBarHozChart * 2) * 0.4 / dataBarHozChart.length;
            var barPadding = (height - axisMargin - marginBarHozChart * 2) * 0.6 / dataBarHozChart.length;
            var dataBarHozChart, bar, svg, scale, xAxis, labelWidth = 0;
            var marginLeftBar = 10;

            function getDisplayValue(data, prefix, suffix) {
                var formatted = $filter('number')(data[1], 2);
                if (prefix) {
                    formatted = prefix + formatted;
                }
                if (suffix) {
                    formatted += suffix;
                }
                return formatted;
            };

            if (!dataBarHozChart || !dataBarHozChart.map) {
                //given this directive is across pages the DOM state could have changed so we need to guard against that.
                return;
            }

            max = d3.max(dataBarHozChart.map(function (i) {
                return i[1];
            }));

            var tipBarHozChart = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 25])
                .html(function (d) {
                    var value = getDisplayValue(d, valuePrefix, valueSuffix);
                    if(d[0] !== null && d[0].lastIndexOf(':') > 0){
                        d[0] = d[0].substring(0, d[0].lastIndexOf(':') +  1) + '<strong>' + d[0].substring(d[0].lastIndexOf(':') +  1) +'</strong>';
                    }
                    return "<div class='new-tool-hn'><div class='cover'><p class='name'>" + d[0] + "</p><p class='text-detail'>" + value + "</p></div></div>";
                });

            barHozChart = d3.select(barHozChart)
                .append("svg")
                .attr("transform", "translate(-4,0)")
                .attr("width", width)
                .attr("height", height)
                .on('mouseout', function () {
                    $('.new-tool-hn').css('display', 'none');
                    $('.new-tool-hn').on('mouseover', function () {
                        $('.new-tool-hn').css('display', 'block');
                    })
                });

            barHozChart.call(tipBarHozChart);

            var bar = barHozChart.selectAll("g")
                .data(dataBarHozChart)
                .enter()
                .append("g");

            bar.attr("class", "bar")
                .attr("cx", 0)
                .attr("transform", function (d, i) {
                    return "translate(" + (marginBarHozChart + marginLeftBar + leftOpera) + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                });

            // add grid
            bar.append("text")
                .attr("class", "label")
                .on('mouseover', tipBarHozChart.show)
                .on('mouseout', tipBarHozChart.hide)
                .attr("y", barHeight / 2)
                .attr("dy", 4) //vertical align middle
                .attr("dx", -leftBarText) //vertical align middle
                .text(function (d) {
                    var text = d[0]; 
                    if (text.length > labelLimit) {
                        text = $filter('limitTo')(text, labelLimit - 3) + '...';
                    }
                    return text;
                }).each(function () {
                    labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                });

            if (arrayOfPics) {
                bar.append('image')
                    .attr("xlink:href", function (d, i) {
                        return arrayOfPics[i];
                    })
                    .on('mouseover', tipBarHozChart.show)
                    .on('mouseout', tipBarHozChart.hide)
                    .attr("class", "country-image")
                    .attr("x", -32)
                    .attr("y", -3)
                    .attr("width", 21)
                    .attr("height", 21);
            }

            scale = d3.scale.linear()
                .domain([0, max])
                .range([0, width - marginBarHozChart * 2 - labelWidth]);

            xAxis = d3.svg.axis()
                .scale(scale)
                .tickSize(-height + 2 * marginBarHozChart + axisMargin)
                .ticks(5)
                .orient("bottom");

            bar.append("rect")
                .attr("transform", "translate(" + labelWidth + ", 0)")
                .attr("height", barHeight)
                .attr("width", function (d) {
                    return scale(d[1]);
                });

            bar.append("text")
                .on('mouseover', tipBarHozChart.show)
                .on('mouseout', tipBarHozChart.hide)
                .attr("class", "value")
                .attr("y", barHeight / 2)
                .attr("dx", -valueMargin + labelWidth) //margin right
                .attr("dy", ".35em") //vertical align middle
                .attr("text-anchor", "end")
                .text(function (d) {
                    return getDisplayValue(d, valuePrefix, valueSuffix);
                })
                .attr("x", function (d) {
                    var selfWidth = this.getBBox().width;
                    return Math.max(selfWidth + valueMargin, scale(d[1]));
                    //return width;
                });

            var xAxisGroup = barHozChart.insert("g", ":first-child")
                .attr("class", "axis")
                .attr("transform", "translate(" + (marginBarHozChart + labelWidth + marginLeftBar - 2) + "," + (height - axisMargin - marginBarHozChart - 1) + ")")
                .attr("data-max", max)
                .attr("data-label-width", labelWidth)
                .call(xAxis);

            // draw col X
            var colYBarHozChart = barHozChart.append("rect")
                .attr("x", 71)
                .attr("y", height - marginBarHozChart - 7)
                .attr("class", "colY")
                .attr("width", width)
                .attr("height", 1);
            
            //call chart resize on window resize
            d3.select(window).on('resize', resize); 
            //resize charts
            function resize() {
                var el = document.getElementById(chartId);
                var width = el.offsetWidth;
                var charts = d3.selectAll("svg")
                    .attr("width", width)
                    .each(function(d, i) {
                        var bars = d3.select(this).selectAll(".bar");        
                        var xAxisGroup = d3.select(this).select(".axis");
                        var max = xAxisGroup.attr("data-max");
                        var labelWidth = xAxisGroup.attr("data-label-width");
                        var scale = d3.scale.linear()
                            .domain([0, max])
                            .range([0, width - marginBarHozChart * 2 - labelWidth]);
                        
                        bars.select("rect").attr("width", function (d) {
                            return scale(d[1]);
                        });
                        
                        var barLabel = bars.select(".value");
                        barLabel.attr("x", function (d) {
                            var selfWidth = this.getBBox().width;
                            return Math.max(selfWidth + valueMargin, scale(d[1]));
                        });

                        xAxis.scale(scale);
                        xAxisGroup.call(xAxis);

                        d3.select(this).select(".colY")
                            .attr("width", width);    
                    });
            }
        };

        // - - - Right Panel - - -
        vm.notificationTypeChanged = function () {
            getNotifications();
        };

        vm.search = function () {
            activate();
        };

        function activate() {
            var promises = [getNotifications(), getNewCaseStudies()];
            return $q.all(promises).then(function () {
            });
        };     

        function getNotifications() {
            var url = angular.copy(baseFeedUrl);
            url = url + encodeURIComponent($scope.selectedNewsTopic);
            DashboardService.parseFeed(url).then(function (res) {
                $scope.notifications = res.query.results.rss.channel.item;
                return $scope.notifications;
            });
        };

        function getNewCaseStudies() {
            return dataService.getLatestCaseStudies(config.DASHBOARD_CASE_STUDY_COUNT).then(function (data) {
                $scope.casestudies = [];
                for (var index in data.items) {
                    var item = data.items[index];
                    $scope.casestudies.push({
                        id: item.sys.id,
                        image: {
                            title: (item.fields.thumbnailImage && item.fields.thumbnailImage.fields)
                                ? item.fields.thumbnailImage.fields.title : null,
                            url: (item.fields.thumbnailImage && item.fields.thumbnailImage.fields && item.fields.thumbnailImage.fields.file)
                                ? item.fields.thumbnailImage.fields.file.url : null
                        },
                        title: item.fields.title,
                        postDate: item.fields.postDate,
                        summary: item.fields.summary
                    });
                }
                return $scope.casestudies;
            });
        };

        function showMessage(title, message) {
            vm.messageTitle = title;
            vm.messageText = message;
            vm.showMessage = true;
        };

        init();

        $scope.$on('$destroy', function() {
            d3.select(window).on('resize', null);                      
        });
    }
})();

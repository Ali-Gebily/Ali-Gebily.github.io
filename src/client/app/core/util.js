/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service that provides common utility methods.
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
    angular.module('app.core').factory('util', ['$timeout', '$filter', '$state', 'loginModal', 'config', '$anchorScroll', '$location',
        function ($timeout, $filter, $state, loginModal, config, $anchorScroll, $location) {

            var instance = {};

            instance.exportToCsv = function (headers, data, fileName) {
                var csvContent = instance.getCsvData(headers, data);
                var ieVersion = msieversion();
                if (ieVersion > -1) {
                    //this solution is based on this thread: 
                    //http://stackoverflow.com/questions/18755750/saving-text-in-a-local-file-in-internet-explorer-10

                    if (ieVersion >= 10) {
                        var csvFileAsBlob = new Blob([csvContent], {
                            type: 'text/plain'
                        });
                        window.navigator.msSaveBlob(csvFileAsBlob, fileName);
                    }
                    else {
                        var frame = document.createElement('iframe');
                        frame.style.display = "none";
                        document.body.appendChild(frame);
                        frame.contentWindow.document.open("text/plain", "replace");
                        frame.contentWindow.document.charset = "utf-8";
                        frame.contentWindow.document.write(/*'sep=,\r\n' + */csvContent);
                        frame.contentWindow.document.close();
                        frame.contentWindow.focus();
                        var success = frame.contentWindow.document.execCommand('SaveAs', true, fileName + ".txt");
                        document.body.removeChild(frame);
                        if (!success) {
                            alert("Sorry, your browser does not support this feature or you canceled.");
                        }
                    }
                } else {
                    csvContent = "data:text/csv;charset=utf-8," + csvContent;
                    var encodedUri = encodeURI(csvContent);
                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link); // Required for FF
                    link.click(); // This will download the data file
                }
            };

            instance.getCsvData = function (headers, data) {
                var csvContent = headers.join(",") + "\n";
                data.forEach(function (infoArray, index) {
                    csvContent += infoArray.join(",");
                    if (index < data.length) {
                        csvContent += "\n";
                    }
                });
                return csvContent;
            };

            instance.getCsvBase64Data = function (headers, data) {
                var csvContent = instance.getCsvData(headers, data);
                var result = window.btoa(unescape(encodeURIComponent(csvContent)));
                return result;
            };

            function msieversion() {
                var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
                    ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
                    ieEDGE = navigator.userAgent.match(/Edge/g),
                    ieVer = (ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

                return parseFloat(ieVer);
            }; 
            instance.customizePdfSize = function (pdfContainer) {
                if (msieversion() > -1) {
                    var valid = true;
                    if ($(pdfContainer).height() > 8192) {
                        valid = false;
                        $(pdfContainer).css("max-height", "8192px");
                    }
                    if ($(pdfContainer).width() > 8192) {
                        $(pdfContainer).css("max-width", "8192px");
                        valid = false;
                    }
                    if (!valid) {
                        alert("The exported data is larger than max size, data will be cropped. You can use chrome or Firefox browsers to export large data");
                    }
                }
            };
            instance.resetPdfSize = function (pdfContainer) {
                if (msieversion() > -1) {
                    $(pdfContainer).css("max-height", "");
                    $(pdfContainer).css("max-width", "");
                }
            }; 
            function getBrowser() {
                var c = navigator.userAgent.search("Chrome");
                var f = navigator.userAgent.search("Firefox");
                var m8 = navigator.userAgent.search("MSIE 8.0");
                var m9 = navigator.userAgent.search("MSIE 9.0");
                if (c > -1) {
                    return "Chrome";
                } else if (f > -1) {
                    return "Firefox";
                } else if (m9 > -1) {
                    return "MSIE 9.0";
                } else if (m8 > -1) {
                    return "MSIE 8.0";
                }
                return null;
            }

            function isFirefox() {
                return getBrowser() === 'Firefox';
            }
            var _lastConnectionError = null;
            var _lastConnectionErrorTimeout = null;
            instance.handleHttpError = function (error) {
                if(error.status == -100) //Request cancelled manually
                {
                    return
                }
                /*If we had a connection error that is handled previously, then ignore next connection errors,
                this case occurs if we had a screen that sends more than one request at a time, */
                if (_lastConnectionError && error.status == -1 )
                {
                    return;
                }
                clearTimeout(_lastConnectionErrorTimeout);
                if (error.status == -1) { //connection error
                _lastConnectionError = error;
                //clear last connection error after 2 seconds
                _lastConnectionErrorTimeout = setTimeout(function() {
                    _lastConnectionError = null;
                }, 2000);
                }
                else {
                 _lastConnectionError = null;
                }
                //sometimes error object contains message as object not as string
                var msg = error.message;
                if (error.message && error.message.message) {
                    msg = error.message.message
                }
                /* in case of cancelling http request, an error with "null" message is raised
                // so will ignore null values for alert for better user experience
                we will just write error to the console*/
                if(!msg && error.status == -1)
                {
                    msg="Unable to connect to server.";
                }
                if (msg) { 
                    alert(msg);
                }
                else
                {
                    console.error(error);
                }
            };

            instance.toCsv = function (array) {
                return array.join(", ");
            };

            instance.trimLeft = function (text, charsToTrim) {
                if (!text) {
                    return text;
                }

                if (charsToTrim === undefined) {
                    charsToTrim = "\s";
                }

                return text.replace(new RegExp("^[" + charsToTrim + "]+"), "");
            };

            instance.trimLength = function (text, maxLength) {
                if (!text || text.length <= maxLength) {
                    return text;
                }
                return $filter('limitTo')(text, maxLength) + '...';
            };

            instance.validateSearchQuery = function (query, errorHandler) {
                var message;
                if (query.yearStart > query.yearEnd) {
                    message = "Start year cannot be greater than end year.";
                }
                else if (query.commodityCodes.length == 0 || query.importerCountryCodes.length == 0 || query.exporterCountryCodes.length == 0) {
                    message = "Please fill all search parameters.";
                }
                else if (query.commodityCodes.length == 1 && query.importerCountryCodes.length == 1) {
                    if (query.exporterCountryCodes.length > config.SEARCH_DATA_MAX_EXPORTERS_COUNT) {
                        message = "Number of Exporters cannot be greater than " + config.SEARCH_DATA_MAX_EXPORTERS_COUNT;
                    }
                }
                else if (query.commodityCodes.length == 1 && query.exporterCountryCodes.length == 1) {
                    if (query.importerCountryCodes.length > config.SEARCH_DATA_MAX_IMPORTERS_COUNT) {
                        message = "Number of Importers cannot be greater than " + config.SEARCH_DATA_MAX_IMPORTERS_COUNT;
                    }
                }
                else if (query.exporterCountryCodes.length == 1 && query.importerCountryCodes.length == 1) {
                    if (query.commodityCodes.length > config.SEARCH_DATA_MAX_COMMODITIES_COUNT) {
                        message = "Number of Commodities cannot be greater than " + config.SEARCH_DATA_MAX_COMMODITIES_COUNT;
                    }
                }
                else {
                    message = "Only one of Commodities/Importers/Exporters can have multiple values.";
                }

                if (message) {
                    if (errorHandler) {
                        errorHandler('Query validation error!', message);
                    }
                    else {
                        alert(message);
                    }
                    return false;
                }

                return true;
            };

            instance.withTimeout = function (callback, delay) {
                if (!delay) {
                    delay = 10;
                }
                $timeout(callback, delay);
            };

            instance.login = function () {
                return loginModal();
            }

            instance.register = function () {
                instance.scrollToTop();
                $state.go('register');
            }

            // - - - UI helper methods - - -

            instance.scrollToTop = function () {
                $anchorScroll();
            };

            instance.scrollTo = function (hash, offset) {
                instance.withTimeout(function () {
                    if (offset) {
                        $anchorScroll.yOffset = offset;
                    }

                    $anchorScroll(hash);
                    $anchorScroll.yOffset = 0;
                });
            };

            instance.showMessage = function (scope, title, message) {
                scope.messageTitle = title;
                scope.messageText = message;
                scope.showMessage = true;
            };

            instance.hideAllPopups = function () {
                $(".setting-dash").addClass("hide");
                $(".over-lay").removeClass("show");
            };

            instance.applyNiceSelect = function (selector) {
                $timeout(function () {
                    $(selector).niceSelect();
                }, 100);
            };

            instance.stylizeMultiSelectBox = function (boxId, parentClass, placeholder) {
                instance.withTimeout(function () {
                    if (!placeholder) {
                        placeholder = 'Select';
                    }

                    var box = $(boxId)[0];
                    $(box).SumoSelect({ search: true, searchText: ' ', csvDispCount: 0, selectAll: false, placeholder: placeholder });

                    // remove tag
                    $(parentClass + ' .cover-text-chose').on("click", ".text-chose a", function () {
                        var itemName = $(this).parent().text().trim();
                        $('option', box).each(function (ind, option) {
                            var trimmedText = $(option).text().trim();
                            if (trimmedText == itemName || instance.trimLength(trimmedText, 50) == itemName) {
                                box.sumo.unSelectItem(ind);
                            }
                        });
                    });
                });
            };

            instance.stylizeSelectBox = function (selectElementId, placeholder) {
                if (!placeholder) {
                    placeholder = "Select";
                }
                instance.withTimeout(function () {
                    var box = $(selectElementId)[0];
                    $(box).SumoSelect({ search: true, searchText: ' ', csvDispCount: 100, captionFormatAllSelected: false, selectAll: false, placeholder: placeholder });
                });
            };

            instance.clearDropdownValue = function (selectElementId) {
                instance.withTimeout(function () {
                    var box = $(selectElementId)[0];
                    box.sumo.unSelectAll();
                });
            };

            instance.initDatePicker = function (elementId, defaultDate) {
                $(elementId).datepicker({
                    defaultDate: defaultDate,
                    dateFormat: "mm/dd/yy",
                    numberOfMonths: 1
                }).attr('readonly', 'readonly');
            };

            // - - - Chart helper methods - - -
            instance.drawTradeDataLineChart = function (chartElementId, query, tradeData, chartLegendHandler, yAxisLabel) {
                var chartData = {};

                for (var index = 0; index < tradeData.length; index++) {
                    var item = tradeData[index];

                    if (!chartData[item.importerCountryCode]) {

                        chartData[item.importerCountryCode] = {role: 'Importer'};

                    }

                    if (!chartData[item.importerCountryCode][item.commodityId]) {
                        chartData[item.importerCountryCode][item.commodityId] = {};
                    }

                    chartData[item.importerCountryCode][item.commodityId][item.year] = query.tradeBy === 'volume' ? item.importedVolume : item.importedValue;

                    if (chartData[item.importerCountryCode][item.commodityId][item.year] === null) {
                        delete chartData[item.importerCountryCode][item.commodityId][item.year];
                    }

                    if (!chartData[item.exporterCountryCode]) {

                        chartData[item.exporterCountryCode] = {role: 'Exporter'};

                    }

                    if (!chartData[item.exporterCountryCode][item.commodityId]) {                    
                        chartData[item.exporterCountryCode][item.commodityId] = {};
                    }

                    chartData[item.exporterCountryCode][item.commodityId][item.year] = query.tradeBy === 'volume' ? item.exportedVolume : item.exportedValue;
                    
                    if (chartData[item.exporterCountryCode][item.commodityId][item.year] === null) {
                        delete chartData[item.exporterCountryCode][item.commodityId][item.year];
                    }
                }

                return drawChart(chartElementId, chartData, query, chartLegendHandler, yAxisLabel);
            };

            function drawChart(chartElementId, chartData, query, chartLegendHandler, yAxisLabel) {
                var chartLegend = [];

                var colors = [];
                var arrayChart = [];                
                var chartColors = iterifyArr(config.CHART_COLORS);
                chartColors.prev();
                for (var country in chartData) {
                    //var countryValues = [];
                    var commodities = Object.keys(chartData[country]);
                    for (var index in commodities) {
                        var commodity=commodities[index];
                        var countryValues = [];
                        var chartCoords = false;

                        for (var i = query.yearStart; i <= query.yearEnd; i++) {
                            if (typeof chartData[country][commodity][i] !== 'undefined') {
                                countryValues.push({ x: i.toString(), y: chartData[country][commodity][i] });
                                chartCoords = true;
                            }
                        }
                        if (chartCoords) {
                            var color = chartColors.next();
                            if (typeof color === 'undefined') {
                                color = {hex: getRandomColor()};
                            }
                            arrayChart.push(countryValues);
                            colors.push(color.hex);
                            chartLegend.push({
                                name: country,
                                role: chartData[country]['role'],
                                commodity: commodity,
                                style: { background: color.hex }
                            });
                        }
                    }

                }

                if (chartLegendHandler) {
                    chartLegendHandler(chartLegend);
                }

                var data = {
                    arrayChart: arrayChart,
                    colorValue: colors,
                    parseInput: '%Y',
                    parseOutput: '%Y'
                };

                instance.updateChartData(data, chartElementId, yAxisLabel);
                return data;
            };

            instance.updateChartData = function (data, idChart, yAxisLabel) {
                var svgs = $(idChart).find('svg');
                svgs.remove();

                //Convert number of tick
                var numberTick = 8;
                //Start value padding left
                var paddingLeftX = 33;

                var dataset = data.arrayChart;

                var wlineChartWidth = $(idChart).width();
                var padding = 25;
                var hLineChart1;
                var isPreviewChart = $(idChart).hasClass('preview-chart');
                if (isPreviewChart) {
                    hLineChart1 = 210;
                }
                else {
                    padding = 65;
                    hLineChart1 = 359;
                    if (wlineChartWidth <= 100) {
                        wlineChartWidth = $('.main-import').width();
                    }
                }
                var wLineChart1 = wlineChartWidth - 17;

                var parseInputValue = data.parseInput;
                var parseOutputValue = data.parseOutput;

                var parse = d3.time.format(parseInputValue).parse;
                var tickF = d3.time.format(parseOutputValue);
                // Define axis ranges & scales
                var yExtents = d3.extent(d3.merge(dataset), function (d) { return d.y; });
                var xExtents = d3.extent(d3.merge(dataset), function (d) { return parse(d.x); });

                var xScale = d3.time.scale()
                    .domain([xExtents[0], xExtents[1]])
                    .range([padding, wLineChart1 - padding * 2]);

                var yScale = d3.scale.linear()
                    .domain([0, yExtents[1]])
                    .range([hLineChart1 - padding, padding]);

                var colorValue = data.colorValue;

                // Create SVG element
                var lineChart1 = d3.select(idChart)
                    .append("svg")
                    .attr("transform", "translate(" + 0 + ",-23)")
                    .attr("width", wLineChart1)
                    .attr("height", hLineChart1);

                function make_y_axis() {
                    return d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(10)
                };

                lineChart1.append("g")
                    .attr("class", "Ygrid")
                    .style("stroke-dasharray", ("3, 1"))
                    .call(make_y_axis()
                        .tickSize(-wLineChart1, 0, 0)
                        .tickFormat(""));

                // left bar
                var leftBar = lineChart1.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .style('fill', '#fff')
                    .attr("width", padding)
                    .attr("height", hLineChart1);

                if (!isPreviewChart) {
                    lineChart1.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 10)
                        .attr("x", -hLineChart1 / 2)
                        .attr("dy", "1em")
                        .style("text-anchor", "middle")
                        .style("color", "black")
                        .text(yAxisLabel);
                }

                // Define lines
                var line = d3.svg.line()                    
                    .x(function (d) { return xScale(parse(d.x)); })
                    .y(function (d) { return y(d.y1, d.y2); });

                var pathContainers = lineChart1.selectAll('g.line').data(dataset);

                pathContainers.enter().append('g')
                    .attr('class', 'line')
                    .attr("stroke", function (d, i) {
                        return colorValue[i];
                    })
                    .attr("fill", function (d, i) {
                        return colorValue[i];
                    });

                var p = pathContainers.selectAll('path')
                    .data(function (d) { return [d]; }) // continues the data from the pathContainer
                    .enter().append('path')
                    .attr("transform", "translate(" + paddingLeftX + ",0)")
                    .attr('d', d3.svg.line()
                    .defined(function(d) { return d.y != null; })
                    .x(function (d) { return xScale(parse(d.x)); })
                    .y(function (d) { return yScale(d.y); })
                    );

                // Define the div for the tooltip
                var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                // add circles
                pathContainers.selectAll('circle')
                    .data(function (d) { return d; })
                    .enter().append('circle')
                    .attr('cx', function (d) { return xScale(parse(d.x)); })
                    .attr('cy', function (d) { return yScale(d.y); })
                    .attr("transform", "translate(" + paddingLeftX + ",0)")
                    .attr('r', function(d) { return d.y == null ? 0 : 5; })
                    .on("mouseover", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("Year: " + d.x + "<br/>" + "Value: " + d.y)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function (d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                //Define X axis
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("top")
                    .tickSize(-0, 0, 0)
                    .tickFormat(tickF)
                    .ticks(numberTick);

                //Define X axis 2  for show Year
                var xAxis2 = d3.svg.axis()
                    .scale(xScale)
                    .orient("top")
                    .tickSize(-0, 0, 0)
                    .tickFormat(d3.time.format("%Y"))
                    .ticks(5);

                //Define Y axis
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickSize(0, 0, 0)
                    .tickFormat(function (d) {
                        var array = ['', 'k', 'M', 'G', 'T', 'P'];
                        var i = 0;
                        while (d > 1000) {
                            i++;
                            d = d / 1000;
                        }

                        d = d + array[i];
                        return d;
                    })
                    .ticks(4);

                //Add X axis
                lineChart1.append("g")
                    .attr("class", "axis xText")
                    .attr("transform", "translate(" + paddingLeftX + "," + (hLineChart1 - padding + 19) + ")")
                    .call(xAxis);

                //Add Y axis
                lineChart1.append("g")
                    .attr("class", "axis yText")
                    .attr("transform", "translate(" + padding + ",0)")
                    .call(yAxis);
            };

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            };
         

            function iterifyArr (arr) {
                var cur = 0;
                arr.next = (function () { return (++cur >= this.length) ? undefined : this[cur]; });
                arr.prev = (function () { return (--cur < 0) ? undefined : this[cur]; });
                arr.cur = (function () { return this[cur]; });
                return arr;
            };

            var mapDomId;
            var markerData;
            var map;
            // - - - Map helper methods - - -
            instance.drawMap = function (importers, exporters, tradeBy, mapElementId,showMarkers) {
                $('#' + mapElementId).empty();
                var data = {};
               
                var bubblesData = [];
                markerData = [];
                fillCountriesMapData(importers, data, bubblesData, 'importer', tradeBy);
                fillCountriesMapData(exporters, data, bubblesData, 'exporter', tradeBy);

                mapDomId = mapElementId;                

                var popupOnHover = !showMarkers

                var container = $('.cover-left');
                var width = container.width() - 48;
                var height = width * 0.65;
                map = new Datamap({
                    scope: 'world',
                    element: document.getElementById(mapElementId),
                    projection: 'mercator',
                    height: height,
                    width: width,                                    
                    geographyConfig: {
                        popupOnHover: popupOnHover,
                        popupTemplate: function (geography, data) {
                            return '<div class="hoverinfo" style="color: black;">' + data.countryName + ', ' + data.value + '</div>'
                        }
                    },
                    fills: {
                        defaultFill: 'gray',
                        exporter: 'rgba(50,50,240,0.9)',
                        importer: 'rgba(50,240,50,0.9)'
                    },
                    data: data
                });

               map.bubbles(bubblesData,
               {
                    popupOnHover: popupOnHover,
                    popupTemplate: function (geography, data) {
                        return '<div class="hoverinfo" style="color: black;">' + data.name + ', ' + data.value + '</div>'
                    }
               });

               if(showMarkers){
                    map.addPlugin('markers', handleMarkers);

                    map.markers([]);
                    setMarkers(data, markerData);
                    setMarkers(bubblesData, markerData);
                    map.markers(markerData);

                    instance.arrangeMarkers();
                }
                
            };

            function handleMarkers (layer, data, options ) {
                var self = this;
                var latLng ={};                

                if ( !data || (data && !data.slice) ) {
                    throw "Datamaps Error - markers must be an array";
                }

               

                for(i= 0 ; i < data.length ; i++)
                {
                    
                    latLng = getCoordinates(data[i],self);                                     
                    var div = document.createElement("div");                    
                    div.className = "marker-label";
                    div.style.zIndex = "10001";
                    div.style.position = "absolute";
                    div.style.display = "block";
                    div.style.top = latLng[1] + 'px';
                    div.style.left = latLng[0] + 'px';                       
                    div.insertAdjacentHTML( 'beforeend', '<div class="hoverinfo" style="color: black;">' + data[i].name + ', ' + data[i].dataValue + '</div>' );
                    if(document.getElementById(mapDomId) && document.getElementById(mapDomId) != null){
                        document.getElementById(mapDomId).appendChild(div);
                    }
                }                

            };

            function getCoordinates(data, self) {
                var latLng = {};
                if (datumHasCoords(data)) {
                    latLng = self.latLngToXY(data.latitude, data.longitude);
                }
                else if (data && data.centered) {
                    switch (data.centered) {
                        case "USA":
                            latLng = self.latLngToXY(41.140276, -100.760145)
                            break;
                        case "CAN":
                            latLng = self.latLngToXY(56.624472, -114.665293);
                            break;
                        case "JPN":
                            latLng = self.latLngToXY(35.689487, 139.691706);
                            break;
                        case "CHL":
                            latLng = self.latLngToXY(-33.448890, -70.669265);
                            break;
                        case "IDN":
                            latLng = self.latLngToXY(-6.208763, 106.845599);
                            break;
                        case "MYS":
                            latLng = self.latLngToXY(14.599512, 120.984219);
                            break;
                        case "NOR":
                            latLng = self.latLngToXY(59.913869, 10.752245);
                            break;
                        default: 
                            latLng = self.path.centroid(map.svg.select('path.' + data.centered).data()[0]);
                    }                    
                }
                return latLng; 
            }

            function setMarkers(data, markerData) {                              
                _.forEach(data, function(mapCountry, key) {
                        if(datumHasCoords(mapCountry)){
                            markerData.push({name:mapCountry.name,latitude:mapCountry.latitude,longitude:mapCountry.longitude,dataValue:mapCountry.value });     
                        }
                        else{
                            markerData.push({name:mapCountry.countryName,centered:key,dataValue:mapCountry.value });     
                        }                                
                    });                   
            };

             function datumHasCoords (datum) {
                    return typeof datum !== 'undefined' && typeof datum.latitude !== 'undefined' && typeof datum.longitude !== 'undefined';
            };

            instance.arrangeMarkers = function (){
                var latLng ={};
                var move = 1;
                while(move > 0) {
                    move = 0;
                    $(".marker-label")
                    .each(function() {
                        var that = this,
                            a = this.getBoundingClientRect();
                        $(".marker-label")
                            .each(function() {
                            if(this != that) {
                                var b = this.getBoundingClientRect();
                                if((Math.abs(a.left - b.left) * 1.5 < (a.width + b.width)) &&
                                (Math.abs(a.top - b.top) * 1.5 < (a.height + b.height))) {
                                    // overlap, move labels
                                    var dx = (Math.max(0, a.right - b.left) +
                                            Math.min(0, a.left - b.right)) * 0.01,
                                        dy = (Math.max(0, a.bottom - b.top) +
                                            Math.min(0, a.top - b.bottom)) * 0.02;                                
                                    move += Math.abs(dx) + Math.abs(dy);
                                    
                                    this.style.left = Number(this.style.left.replace('px','')) - dx + 'px';
                                    this.style.top = Number(this.style.top.replace('px','')) - dy + 'px';
                                    
                                    that.style.left = Number(that.style.left.replace('px','')) + dx + 'px';
                                    that.style.top = Number(that.style.top.replace('px','')) + dy + 'px';
                                
                                    a = this.getBoundingClientRect();
                                }
                            }
                            });
                    });
                }
                
                var i = 0;
                $(".marker-label")
                .each(function() {
                    latLng =  getCoordinates(markerData[i], map);
                    map.svg.selectAll(".markers")
                    .append("line")
                    .attr("x1", Number(this.style.left.replace('px','')))
                    .attr("y1", Number(this.style.top.replace('px','')) + 10)
                    .attr("x2", latLng[0])
                    .attr("y2", latLng[1])
                    .style("stroke", "#000")
                    .style("stroke-width", 1);
                    i++;
                 });                  
            }

            function fillCountriesMapData(countriesData, mapData, bubblesData, countryType, tradeBy) {
                var smallCountries = config.SMALL_COUNTRY_MAP_DATA;
                for (var countryName in countriesData) {
                    var smallCountry = _.find(smallCountries, { 'name': countryName });
                    if (smallCountry) {
                        var value = countriesData[countryName];
                        if(value){
                            value=value .toLocaleString('en-US');
                        }
                        if (tradeBy === 'volume') {
                            value += ' kg';
                        }
                        else {
                            value = '$ ' + value;
                        }

                        bubblesData.push({
                            name: smallCountry.name,
                            radius: smallCountry.radius,
                            fillKey: countryType,
                            latitude: smallCountry.latitude,
                            longitude: smallCountry.longitude,
                            value: value,
                            borderWidth: 1,
                            fillOpacity: 1
                        });
                    }
                    else {

                        var code = config.COUNTRY_CODE_MAPPING[countryName];
                        if (code) {
                            var value = countriesData[countryName];
                            if(value){
                                value=value .toLocaleString('en-US');
                            }
                            if (tradeBy === 'volume') {
                                value += ' kg';
                            }
                            else {
                                value = '$ ' + value;
                            }

                            mapData[code] = { fillKey: countryType, value: value, countryName: countryName }
                        }
                    }
                }
            };

          /*we need override drawImage method to skip error at rendering broken images: check issue #81*/
            var _drawImageOverriden = false;
            // - - - SVG helper methods - - -
            instance.svgToPng = function (svgParentId, width, height, styleSheet, func) {
                if (!_drawImageOverriden) {
                    var originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
                    CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
                        try {

                            return originalDrawImage.apply(this, arguments);
                        }
                        catch (error) {
                            return null;
                        }
                    };
                    _drawImageOverriden = true;
                } 
                var svg = $('svg', $(svgParentId));

                // check whether style should be applied
                if (styleSheet) {
                    var styles = loadStyles([styleSheet]);

                    var defs = $('defs', svg);
                    if (!defs.length) {
                        svg.prepend('<defs></defs>');
                        defs = $('defs', svg).first();
                    }

                    var style = $('style', defs);
                    if (!style.length) {
                        defs.prepend('<style type="text/css"></style>');
                        var style = $('style', defs).first();
                        style.html(styles);
                    }
                }

                var serializer = new XMLSerializer();
                var svgStr = serializer.serializeToString(svg[0]);

                var canvas = $('#hiddenCanvas')[0];
                canvas.width = width;
                canvas.height = height;
                /*this line: canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
               cause security error in IE due to cross domain issue as Internet Explorer will still not 
               allow SVG to be drawn to html5 Canvas without tainting the canvas.
               we will use canvg function for handling all browsers. 
               */
                canvg(canvas, svgStr,
                    {
                        ignoreDimensions: true, //does not try to resize canvas
                        scaleWidth: width,
                        scaleHeight: height,
                        renderCallback: function () {
                            var pngImg = canvas.toDataURL("image/png");
                            func(pngImg.substring(22));
                        }
                    }
                );

            };

            function loadStyles(requiredSheets) {
                // get styles from all required stylesheets
                var style = "\n";
                for (var i = 0; i < document.styleSheets.length; i++) {
                    var sheet = document.styleSheets[i];
                    if (sheet.href) {
                        var sheetName = sheet.href.split('/').pop();
                        if (requiredSheets.indexOf(sheetName) != -1) {
                            var rules = sheet.rules;
                            if (isFirefox()) {
                                rules = sheet.cssRules;
                            }
                            if (rules) {
                                for (var j = 0; j < rules.length; j++) {
                                    style += (rules[j].cssText + '\n');
                                }
                            }
                        }
                    }
                }
                return style;
            };

            return instance;
        }]);
})();
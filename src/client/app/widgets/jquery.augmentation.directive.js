(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('jqueryAugmentation', jqueryAugmentation);

    jqueryAugmentation.$inject = ['dataservice', 'config'];
    /* @ngInject */
    function jqueryAugmentation(dataservice, config) {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {

            var y;
            var left1, left2, left3, left4, left5, left6, left7, left8, left9;

            //scroll top
            function scrollTopPage() {
                $("body,html").animate({
                    scrollTop: 0
                }, 200);
            }

            //click footer Login
            $("footer .cover-footer .group-one.navi-foot ul li:nth-child(8)").click(function () {
                showPopupLogin();
            });

            $("header .navigate ul li:nth-child(5)").click(function () {
            });

            $("header .navigate ul li:nth-child(6)").click(function () {
            });

            // $(".run-search").click(function(){
            //   $(".alert-table-list").removeClass("hide");
            // });

            //hidden All Popup
            function hiddenAllPopup() {
                $(".setting-dash").addClass("hide");
                $(".over-lay").removeClass("show");
            }

            //click register Now
            $(".popup-login .body-login .text-bottom a").click(function () {
                window.location = "register-page.html";
            });


            //==========Landing Page============

            //show Popup Login
            function showPopupLogin() {
                $(".popup-login").removeClass("hide").addClass("show");
                $(".over-lay").removeClass("hide").addClass("show");
                $("header").addClass("blur");
                $("footer").addClass("blur");
                $(".main-container").addClass("blur");
                $("body").addClass("lock-scroll");
                scrollTopPage();
            }

            // hidden Popup Login
            function hiddenPopupLogin() {
                $(".popup-login").removeClass("show").addClass("hide");
                $(".over-lay").removeClass("show").addClass("hide");
                $("header").removeClass("blur");
                $("footer").removeClass("blur");
                $(".main-container").removeClass("blur");
                $("body").removeClass("lock-scroll");
            }

            //click button Register
            $(".btn-reg").click(function () {
                window.location = "register-page.html";
            });

            //repeat data json
            $.getJSON("data/landingData.json",
              function (data) {
                  var row;
                  for (var i = 0; i < data.length; i++) {
                      row = "<div class=\"items\"><a href=\"javascript:;\" class=\"img\"> <img src=\"" + data[i].image
                        + "\" alt=\"IMG\"><i class=\"icons\"></i></a><div class=\"cover-text\">"
                        + "<p class=\"title-i\">" + data[i].title + "</p>"
                        + "<p class=\"text-detail\">" + data[i].description + "</p></div>"
                      $(".dashboard-page .body-app .cover-group").append(row);
                  }
              });

            //==========Register Page============
            $(".login-btn-register").click(function () {
                showPopupLogin();
            });

            //==========Dashboard Page============
            $(".dropdown-country-trendin").val("United States");


            $(".dashboard-page .dash-page .tool.setting-tool").click(function () {
                oldDataCountrySetting = $(".setting-dash.dashboard-page .country").clone().html();
                $(".dashboard-page.setting-dash").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();

                if ($('#SlectBoxOne').length) {
                    $('#SlectBoxOne')[0].sumo.unSelectAll();
                    for (var i = 0; i < document.querySelectorAll('.setting-dash.dashboard-page .country .green-box').length; i++) {
                        var textCheck = document.querySelectorAll('.setting-dash.dashboard-page .country .green-box')[i].textContent;
                        $('#SlectBoxOne')[0].sumo.selectItem(textCheck);
                        $('#SlectBoxOne').SumoSelect({ searchText: 'Select' });
                    }
                }
                $(".dashboard-page.setting-dash .drop-down-here .SumoSelect .SelectBox span").text("Select");
            });

            //listen check sumoSelect
            if ($("#SlectBoxOne").length) {
                $("#SlectBoxOne").parent().on('click', ".options li", function (event, ui) {
                    if (!$(this).hasClass('selected')) {
                        for (var i = 0; i < document.querySelectorAll('.setting-dash.dashboard-page .country .green-box').length; i++) {
                            var textCheck = $(this).find('label')[0].innerText;
                            if (textCheck === document.querySelectorAll('.setting-dash.dashboard-page .country .green-box')[i].textContent) {
                                document.querySelectorAll('.setting-dash.dashboard-page .country .green-box')[i].remove();
                            }
                        }
                    }
                });
            }

            //click manage Dashboard
            var oldDataDashboardHmtl;
            $("header .under-header .btn-dash .guide.three").click(function () {
                $(".main-container .dash-page").addClass("manager-style");
                $("header").addClass("manager-style-header");
                oldDataDashboardHmtl = $(".dashboard-page .body-dash").clone().html();
                // disply disabled widged again
                $(".opac-dash").parent().parent().parent().css("display", "block");
                // Drag drop
                $("#myDashboard2").sortable({
                    tolerance: 'pointer',
                    revert: 'invalid',
                    forceHelperSize: true,
                    handle: '.handle',
                    update: function (event, ui) {
                        $("#contain-three").toggleClass("p-padding");
                    },
                    start: function (event, ui) {
                        $(".shadow-box").addClass("opac-all");
                        console.log();
                        if ($(this).find("#contain-three").zIndex() === 1000) {
                            $(this).find("#contain-three").removeClass('opac-all');
                        }

                        if ($(this).find("#contain-four").zIndex() === 1000) {
                            $(this).find("#contain-four").removeClass('opac-all');
                        }


                    },
                    stop: function (event, ui) {
                        $(".shadow-box").removeClass("opac-all");
                    }
                });

                $("#myDashboard3").sortable({
                    tolerance: 'pointer',
                    revert: 'invalid',
                    forceHelperSize: true,
                    handle: '.handle',
                    update: function (event, ui) {
                        $("#contain-five").toggleClass("p-padding");
                    },
                    start: function (event, ui) {
                        $(".shadow-box").addClass("opac-all");
                        console.log();
                        if ($(this).find("#contain-five").zIndex() === 1000) {
                            $(this).find("#contain-five").removeClass('opac-all');
                        }

                        if ($(this).find("#contain-six").zIndex() === 1000) {
                            $(this).find("#contain-six").removeClass('opac-all');
                        }
                    },
                    stop: function (event, ui) {
                        $(".shadow-box").removeClass("opac-all");
                    }
                });
            });

            //click manage Dashboard
            $("header .under-header .btn-dash .guide.five").click(function () {
                $(".main-container .dash-page").removeClass("manager-style");
                $("header").removeClass("manager-style-header");
                $(".body-dash .opac-dash").removeClass('opac-dash');
                $(".onoffswitch input").prop('checked', true);
                $(".dashboard-page .body-dash").html(oldDataDashboardHmtl);
            });

            //click manage Dashboard
            $("header .under-header .btn-dash .guide.four").click(function () {
                $(".main-container .dash-page").removeClass("manager-style");
                $("header").removeClass("manager-style-header");

                if ($(".opac-dash").hasClass('top-box') || $(".opac-dash").hasClass('bottom-box')) {
                    $(".opac-dash").css("display", "none");
                } else {
                    $(".opac-dash").parent().parent().parent().css("display", "none");
                }
            });

            //disable by checkbox
            $(".main-container").on("change", ".onoffswitch input:checkbox", function () {
                if (!$(this).is(':checked')) {
                    $(this).parent().parent().parent().parent().addClass("opac-dash");

                    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                        $(this).parent().find("label .onoffswitch-switch").css("border", 0);
                    }
                } else {
                    $(this).parent().parent().parent().parent().removeClass("opac-dash");
                    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                        $(this).parent().find("label .onoffswitch-switch").css("border", 1 + "px solid #8CC423");
                    }
                }
            });

            //click tab trend In
            $(".dash-trends-in-group .year-tag .left-bar .tab-monthly").click(function () {
                $(".dash-trends-in-group .year-tag .left-bar .tab-anual").removeClass("active");
                $(".dash-trends-in-group .year-tag .left-bar .tab-monthly").addClass("active");

                $(".dash-trends-in-group .year-tag .year-main .month").removeClass("hide");
                $(".dash-trends-in-group .year-tag .year-main .year").addClass("hide");
            });

            $(".dash-trends-in-group .year-tag .left-bar .tab-anual").click(function () {
                $(".dash-trends-in-group .year-tag .left-bar .tab-monthly").removeClass("active");
                $(".dash-trends-in-group .year-tag .left-bar .tab-anual").addClass("active");

                $(".dash-trends-in-group .year-tag .year-main .year").removeClass("hide");
                $(".dash-trends-in-group .year-tag .year-main .month").addClass("hide");
            });

            $(".dash-trends-in-group .year-tag .year-main .month a").click(function () {
                $(".dash-trends-in-group .year-tag .year-main .month a").removeClass("active");
                $(this).addClass("active");

                var attr = $(this).attr('data-month');
                var yearElem = $(this).siblings('.year');

                // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
                if (typeof attr !== typeof undefined && attr !== false) {
                    // Element has this attribute
                    $(".chart-here .cover-chart .title-chart.line-tab").text(attr + " " + yearElem.attr('data-year'));
                }

                dataservice.monthlyLineData(attr).then(function (data) {
                    var svgs = $('.line-chart:not(.line-chart-new)').find('svg');
                    svgs.remove();
                    updateData(data, "#lineChart1");
                })
            });

            $(".dash-trends-in-group .year-tag .year-main .year a").click(function () {
                $(".dash-trends-in-group .year-tag .year-main .year a").removeClass("active");
                $(this).addClass("active");


                $(".chart-here .cover-chart .title-chart.line-tab").text("Year " + $(this).html());
                dataservice.yearlyLineData($(this).html()).then(function (data) {
                    var svgs = $('.line-chart:not(.line-chart-new)').find('svg');
                    svgs.remove();
                    updateData(data, "#lineChart2");
                })


            });

            //click Tab global trends
            $(".dash-global-trends-group .year-tag .left-bar .tab-monthly").click(function () {
                $(".dash-global-trends-group .year-tag .left-bar .tab-anual").removeClass("active");
                $(".dash-global-trends-group .year-tag .left-bar .tab-monthly").addClass("active");

                $(".dash-global-trends-group .year-tag .year-main .month").removeClass("hide");
                $(".dash-global-trends-group .year-tag .year-main .year").addClass("hide");
            });

            $(".dash-global-trends-group .year-tag .left-bar .tab-anual").click(function () {
                $(".dash-global-trends-group .year-tag .left-bar .tab-monthly").removeClass("active");
                $(".dash-global-trends-group .year-tag .left-bar .tab-anual").addClass("active");

                $(".dash-global-trends-group .year-tag .year-main .year").removeClass("hide");
                $(".dash-global-trends-group .year-tag .year-main .month").addClass("hide");
            });

            $(".dash-global-trends-group .year-tag .year-main .month a").click(function () {
                $(".dash-global-trends-group .year-tag .year-main .month a").removeClass("active");
                $(this).addClass("active");
            });

            $(".dash-global-trends-group .year-tag .year-main .year a").click(function () {
                $(".dash-global-trends-group .year-tag .year-main .year a").removeClass("active");
                $(this).addClass("active");
            });

            function updateData(data, idChart) {
                // Start value
                var beginValue = 4;
                //Convert number of tick
                var numberTick = 8;
                //Start value padding left
                var paddingLeftX = 33;

                var dataset = data.arrayChart;

                var wlineChartWidth = $('.cover-chart').width();
                if (wlineChartWidth < 769) {
                    wlineChartWidth = 769;
                }
                var wLineChart1 = wlineChartWidth - 17;
                var hLineChart1 = 359;
                var padding = 45;
                var now = d3.time.hour.utc(new Date);


                function drawLineChart(series) {
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
                      .attr("height", hLineChart1 - 20);

                    function make_y_axis() {
                        return d3.svg.axis()
                          .scale(yScale)
                          .orient("left")
                          .ticks(10)
                    }


                    lineChart1.append("g")
                      .attr("class", "Ygrid")
                      .style("stroke-dasharray", ("3, 1"))
                      .call(make_y_axis()
                        .tickSize(-wLineChart1 + 2, 0, 0)
                        .tickFormat("")
                      )

                    // left bar
                    var leftBar = lineChart1.append("rect")
                      .attr("x", 1)
                      .attr("y", 0)
                      .style('fill', '#fff')
                      .attr("width", padding)
                      .attr("height", hLineChart1);

                    // Define lines
                    var line = d3.svg.line()
                      .x(function (d) { return xScale(parse(d.x)); })
                      .y(function (d) { return y(d.y1, d.y2); });

                    var pathContainers = lineChart1.selectAll('g.line')
                      .data(dataset);

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
                        .x(function (d) { return xScale(parse(d.x)); })
                        .y(function (d) { return yScale(d.y); })
                      );

                    // add circles
                    pathContainers.selectAll('circle')
                      .data(function (d) { return d; })
                      .enter().append('circle')
                      .attr('cx', function (d) { return xScale(parse(d.x)); })
                      .attr('cy', function (d) { return yScale(d.y); })
                      .attr("transform", "translate(" + paddingLeftX + ",0)")
                      .attr('r', 5);

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

                    // draw col X
                    var colX = lineChart1.append("rect")
                      .attr("x", padding)
                      .attr("y", padding)
                      .attr("class", "colX")
                      .attr("width", 1)
                      .attr("height", hLineChart1 - padding * 2);


                    // draw red point
                    var redPoint = lineChart1.append('circle')
                      .attr("cx", 78)
                      .attr("cy", 132)
                      .attr("class", "red-point")
                      .attr("r", 6.5);

                    var redPoint2 = lineChart1.append('circle')
                      .attr("cx", 78)
                      .attr("cy", 92)
                      .attr("class", "red-point")
                      .attr("r", 6.5);

                    var redPoint3 = lineChart1.append('circle')
                      .attr("cx", wLineChart1 - 57)
                      .attr("cy", 78)
                      .attr("class", "red-point")
                      .attr("r", 6.5);

                    var redPoint4 = lineChart1.append('circle')
                      .attr("cx", wLineChart1 - 57)
                      .attr("cy", 165)
                      .attr("class", "red-point")
                      .attr("r", 6.5);


                    // draw red total 1
                    var redTotal = lineChart1.append("rect")
                      .attr("x", 66)
                      .attr("y", 79)
                      .attr("class", "red-total")
                      .attr("rx", 13)
                      .attr("width", 24)
                      .attr("height", 68);

                    // draw red total 2
                    var redTotal2 = lineChart1.append("rect")
                      .attr("x", wLineChart1 - 69)
                      .attr("y", 67)
                      .attr("class", "red-total")
                      .attr("rx", 13)
                      .attr("width", 24)
                      .attr("height", 112);

                    // add tooltil on red totals
                    $(".red-total")
                      .hover(function () {
                          // Hover over code
                          $(".tool-chart-sure")
                            .css("display", "block");
                      }, function () {
                          // Hover out code
                          $(".tool-chart-sure")
                            .css("display", "none");
                      })
                      .mousemove(function (e) {
                          var mousex = e.clientX + 20; //Get X coordinates
                          var mousey = e.clientY - 80; //Get Y coordinates
                          $(".tool-chart-sure")
                            .css({ top: mousey, left: mousex })
                      });


                    //Add X axis
                    lineChart1.append("g")
                      .attr("class", "axis xText")
                      .attr("transform", "translate(" + paddingLeftX + "," + (hLineChart1 - padding + 19) + ")")
                      .call(xAxis);


                    //Add Y axis
                    var left = 40;
                    lineChart1.append("g")
                      .attr("class", "axis yText")
                      .attr("transform", "translate(" + left + ",0)")
                      .call(yAxis);

                }
                drawLineChart();
            }

            function reDrawLineChart() {
                // load json data
                dataservice.lineData().then(function (data) {
                    var svgs = $('.line-chart:not(.line-chart-new)').find('svg');
                    svgs.remove();
                    for (var i = 0; i < data.length; i++) {
                        var isChart = "#lineChart" + (i + 1);
                        var numberGetChart = i + 1;
                        updateData(data[i], isChart)
                    }
                });

            }

            function resizeLineChartHere() {
                var svgs = $('.line-chart:not(.line-chart-new)').find('svg');
                svgs.remove();
                reDrawLineChart();
            }
            // Line chart
            if ($(".line-chart:not(.line-chart-new)").length) {

                reDrawLineChart();

                // $(window).resize(function() {
                //   resizeLineChartHere();
                // });

                $(window).on("resize", function () {
                    resizeLineChartHere();
                });


                // show hide data for anual and date
                // for anual
                $(".tab-anual.line-tab").click(function () {
                    jQuery(window).trigger('resize');
                    $(".chart-here .cover-chart .title-chart.line-tab").text("Year 2016");
                    $("#lineChart1").addClass("hide");
                    $("#lineChart2").removeClass("hide");
                    dataservice.yearlyLineData('2016').then(function (data) {
                        var svgs = $('.line-chart:not(.line-chart-new)').find('svg');
                        svgs.remove();
                        updateData(data, "#lineChart2");

                    })

                })

                //for date
                $(".tab-monthly.line-tab").click(function () {
                    $(".chart-here .cover-chart .title-chart.line-tab").text("February 2016");
                    $("#lineChart1").removeClass("hide");
                    $("#lineChart2").addClass("hide");
                    dataservice.monthlyLineData('March').then(function (data) {
                        var svgs = $('.line-chart:not(.line-chart-new)').find('svg');
                        svgs.remove();
                        updateData(data, "#lineChart1");
                        $(window).trigger('resize');
                    })
                })

            }

            function reDrawBarHoz() {
                var dataCountry = [
                  ["India", 25000],
                  ["China", 50000],
                  ["USA", 50000],
                  ["Franc", 25000],
                  ["Mexic", 100000],
                  ["Vietna", 50000],
                  ["Swide", 25000],
                  ["Switze", 150000]
                ];
                var dataCompany = [
                  ["Company A", 25000],
                  ["Company B", 50000],
                  ["Company C", 50000],
                  ["Company D", 25000],
                  ["Company E", 100000],
                  ["Company F", 50000],
                  ["Company G", 25000],
                  ["Company H", 150000]
                ];

                var leftBarText = 5;
                var leftOpera = -2;
                function drawBarHozChart() {
                    var max;
                    if (countryCheck === 0) {
                        var dataBarHozChart = dataCountry;
                        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
                        if (isChrome) {
                            leftOpera = 3;
                        }

                    } if (countryCheck === 2) {
                        var dataBarHozChart = dataCompany;
                        leftOpera = -27;
                        console.log("check === 1");
                    }



                    var arrayOfPics = [
                      "images/i/india.png",
                      "images/i/china.png",
                      "images/i/usa.png",
                      "images/i/france.png",
                      "images/i/mexico.png",
                      "images/i/VIE.png",
                      "images/i/swinden.png",
                      "images/i/swithze.png"
                    ];

                    var barHozChart = document.getElementById("barHozChart");
                    if (barHozChart) {
                        var axisMargin = 0,
                          marginBarHozChart = 30,
                          valueMargin = 4,
                          width = barHozChart.offsetWidth,
                          height = barHozChart.offsetHeight,
                          barHeight = (height - axisMargin - marginBarHozChart * 2) * 0.4 / dataBarHozChart.length,
                          barPadding = (height - axisMargin - marginBarHozChart * 2) * 0.6 / dataBarHozChart.length,
                          dataBarHozChart, bar, svg, scale, xAxis, labelWidth = 0;
                    }

                    var marginLeftBar = 10;


                    if (!dataBarHozChart || !dataBarHozChart.map) {
                        //given this directive is across pages the DOM state could have changed so we need to gaurd against that.
                        return;
                    }

                    max = d3.max(dataBarHozChart.map(function (i) {
                        return i[1];
                    }));


                    var tipBarHozChart = d3.tip()
                      .attr('class', 'd3-tip')
                      .offset([-10, 25])
                      .html(function (d) {
                          if (countryCheck === 0) {
                              return "<div class='new-tool-hn'><div class='cover'><p class='name'>Company A</p><p class='text-detail'>Lorem ipsum venue 888New Yord New Yord USA, 0000</p><p class='name clone'>Species ID</p><p class='text-detail'>12345, 67890</p></div></div>";
                          }
                      })

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

                    var yScale = d3.scale.linear()
                      .domain([0, max])
                      .range([height - marginBarHozChart - (axisMargin + 18), marginBarHozChart]);

                    function make_y_axis() {
                        return d3.svg.axis()
                          .scale(yScale)
                          .orient("left")
                          .ticks(1)
                    }

                    var dotGrid = bar.append("g")
                      .attr("class", "Ygrid")
                      .attr("transform", "translate(71,-280)")
                      .style("stroke-dasharray", ("3, 1"))
                      .style("fill", "#dedede")
                      .call(make_y_axis()
                        .tickSize(-width, 0, 0)
                        .tickFormat("")
                      )

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
                      .attr("dy", 2) //vertical align middle
                      .attr("dx", -leftBarText) //vertical align middle
                      .text(function (d) {
                          return d[0];
                      }).each(function () {
                          labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                      });

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
                      .on('mouseover', tipBarHozChart.show)
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
                          return (d[1] + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                      })
                      .attr("x", function (d) {
                          var width = this.getBBox().width;
                          return Math.max(width + valueMargin, scale(d[1]));
                      });

                    barHozChart.insert("g", ":first-child")
                      .attr("class", "axis")
                      .attr("transform", "translate(" + (marginBarHozChart + labelWidth + marginLeftBar - 2) + "," + (height - axisMargin - marginBarHozChart - 1) + ")")

                      .call(xAxis);


                    // draw col X
                    var colXBarHozChart = barHozChart.append("rect")
                      .attr("x", 71)
                      .attr("y", marginBarHozChart - 8)
                      .attr("class", "colX")
                      .attr("width", 1)
                      .attr("height", height - marginBarHozChart * 2);

                    // draw col X
                    var colYBarHozChart = barHozChart.append("rect")
                      .attr("x", 71)
                      .attr("y", height - marginBarHozChart - 7)
                      .attr("class", "colY")
                      .attr("width", width)
                      .attr("height", 1);


                }
                drawBarHozChart();
            }

            // bar hoz chart
            if ($("#barHozChart").length) {
                var countryCheck = 0;

                reDrawBarHoz();






            }

            function drawgroupBar1() {
                // color for bar chart
                var colorGroupBar1 = d3.scale.ordinal()
                  .range(["#00246c", "#78af00", "#0099d2"]);

                // Color for legend
                var color_hash = {
                    0: ["2013", "#00246c"],
                    1: ["2014", "#78af00"],
                    2: ["2015", "#0099d2"]
                }

                var margin = { top: 5, right: 35, bottom: 20, left: 60 },
                  w = $('.colum-chart').width() - margin.left - margin.right,
                  h = 192 - margin.top - margin.bottom;

                var x0 = d3.scale.ordinal()
                  .rangeRoundBands([0, w], .2);
                var x1 = d3.scale.ordinal();
                var y = d3.scale.linear()
                  .range([h, 0]);

                var xAxis = d3.svg.axis()
                  .scale(x0)
                  .orient("bottom");

                var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .tickSize(-0, 0, 0)
                  .ticks(6)

                var yGrid = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(5)
                  .tickSize(-0, 0, 0)
                  .tickFormat("")

                var groupBar1 = d3.select("#groupBar1").append("svg")
                  .attr("width", w + margin.left + margin.right)
                  .attr("height", h + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                d3.json("data/groupData.json", function (error, data) {

                    // Draw grid
                    function make_y_axis() {
                        return d3.svg.axis()
                          .scale(y)
                          .orient("left")
                          .ticks(5)
                    }
                    groupBar1.append("g")
                      .attr("class", "Ygrid")
                      .style("stroke-dasharray", ("3, 3"))
                      .call(make_y_axis()
                        .tickSize(-w, 0, 0)
                        .tickFormat("")
                      )


                    var sectorNames = d3.keys(data[0]).filter(function (key) {
                        return key !== "Country";
                    });
                    data.forEach(function (d) {
                        d.countries = sectorNames.map(function (name) {
                            return { name: name, value: +d[name] };
                        });

                    });

                    x0.domain(data.map(function (d) { return d.Country; }));
                    x1.domain(sectorNames).rangeRoundBands([0, x0.rangeBand()]);
                    y.domain([0, d3.max(data, function (d) {
                        return d3.max(d.countries, function (d) { return d.value; });
                    })]);

                    groupBar1.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + h + ")")
                      .call(xAxis);

                    groupBar1.append("g")
                      .attr("class", "y axis")
                      .attr("transform", "translate(-5," + 0 + ")")
                      .call(yAxis)

                    groupBar1.append("g")
                      .attr("class", "grid")
                      .call(yGrid);

                    var country = groupBar1.selectAll(".country")
                      .data(data)
                      .enter().append("g")
                      .attr("class", "number-value")
                      .attr("transform", function (d) { return "translate(" + x0(d.Country) + ",0)"; });

                    country.selectAll("rect")
                      .data(function (d) { return d.countries; })
                      .enter().append("rect")
                      .attr("width", x1.rangeBand())
                      .attr("x", function (d) { return x1(d.name); })
                      .attr("y", function (d) { return y(d.value); })
                      .attr("height", function (d) { return h - y(d.value); })
                      .style("fill", function (d) { return colorGroupBar1(d.name); });

                    var pointlabels = country.selectAll(".pointlabels")
                      .data(function (d) { return d.countries; })
                      .enter().append("g")
                      .attr("class", "pointlabels")
                      .attr("transform", function (d) {
                          return "translate(" + x1(d.name) + "," + y(d.value) + ")";
                      });

                    pointlabels.append("text")
                      .attr("dy", "15")
                      .attr("x", x1.rangeBand() / 2)
                      .attr("text-anchor", "middle")
                      .text(function (d) { return d.value; });

                    // add yAxis line custom
                    var colX = groupBar1.append("rect")
                      .attr("x", 0)
                      .attr("y", 0)
                      .style('fill', '#dedede')
                      .attr("width", 1)
                      .attr("height", h);
                });

            }

            function drawRadiusChart() {
                $(".knob").knob({
                    change: function (value) {
                    },
                    release: function (value) {
                        console.log("release : " + value);
                    },
                    cancel: function () {
                        console.log("cancel : ", this);
                    },
                    format: function (value) {
                        return value + '%';
                    },
                    draw: function () {
                        $(this.i).css('font-family', 'Open Sans').css('font-size', '40px').css('font-weight', '600').css('width', '81px');
                    }
                });
            }
            // Responses line chart
            function onResizeChart() {
                var chart = $(".colum-chart"),
                  aspect = chart.width() / chart.height(),
                  container = chart.parent();

                var targetWidth = container.width();

                var svgs = $('.colum-chart').find('svg');
                svgs.remove();
                drawgroupBar1();

                var svg = $('.colum-chart').find('svg')[0];
                if (typeof svg !== 'undefined') {
                    svg.setAttribute('width', targetWidth + 'px');

                    svg.setAttribute('viewBox', '0 0 ' + targetWidth + ' ' + Math.round(targetWidth / aspect));
                    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
                }
            }
            // group colum chart
            if ($(".group-bar").length) {

                drawgroupBar1();



                // $(window).on("resize", function() {
                //   onResizeChart();
                // }).trigger("resize");

            }

            // radius chart
            if ($("#radiusChart").length) {

                drawRadiusChart();
            }

            //Dropdown
            if ($(".dropdown-show").length) {
                $('select:not(.ignore)').niceSelect();
            }
            // hover dropdown global
            $(".global-dropdown .nice-select .option").mouseover(function () {
                setTimeout(function () {
                    $(".global-dropdown .tool-tip").css("display", "block");
                }, 100);
                $(".global-dropdown .tool-tip").css("top", ($(this).context.offsetTop + 26) + "px");
            });
            $(".global-dropdown .nice-select .option").mouseout(function () {
                setTimeout(function () {
                    $(".global-dropdown .tool-tip").css("display", "none");
                }, 100);
            });

            // hover dropdown SearchPage
            $(".search-page-show-tool .nice-select .option").mouseover(function () {
                $(".search-page-show-tool .tool-tip").css("display", "block");
                $(".search-page-show-tool .tool-tip").css("top", ($(this).context.offsetTop + 32) + "px");
            });
            $(".search-page-show-tool .nice-select .option").mouseout(function () {
                $(".search-page-show-tool .tool-tip").css("display", "none");
            });

            //add text begin dropdown
            $(".dash-page .body-dash .cover-right .notificate .head .tool.right-text .nice-select .current").text("All");

            $(".cover-chart .map .drop-down .list li:first-child").click(function () {
                setTimeout(function () {
                    $(".cover-chart .map .drop-down .nice-select .current").text("All");
                }, 10);
            })

            var tagCountrys;
            var oldDataCountrySetting;
            $(".setting-dash.dashboard-page .sub").click(function () {
                //add new country
                tagCountrys = $(".dropdown-dashboard-reporter-country").parent().find(".CaptionCont.SelectBox").text().split(",");
                console.log(tagCountrys);
                var isCheckOk;
                for (var i = 0; i < tagCountrys.length; i++) {
                    tagCountrys[i] = tagCountrys[i].trim();
                    isCheckOk = true;
                    for (var j = 0; j < document.querySelectorAll('.setting-dash.dashboard-page .country .green-box').length; j++) {
                        var textCheck = document.querySelectorAll('.setting-dash.dashboard-page .country .green-box')[j].textContent;
                        if (tagCountrys[i].trim().toLowerCase() === textCheck.trim().toLowerCase()) {
                            isCheckOk = false;
                            break;
                        }
                    }
                    if (tagCountrys[i] !== "Select" && tagCountrys[i] !== "" && isCheckOk) {
                        var row = "<p class=\"green-box\">" + tagCountrys[i] + "<a class=\"icons unless\" href=\"javascript:;\"></a></p>";
                        $(".setting-dash.dashboard-page .country").append(row);
                        j = document.querySelectorAll('.setting-dash.dashboard-page .country .green-box').length;
                    }
                }
                $(this).parent().find(".drop-down-here .SumoSelect .SelectBox span").text("Select");
                tagCountrys = [];
            });

            //click remove tag DashBoard
            $(".setting-dash.dashboard-page .country").on("click", "a", function () {
                $('#SlectBoxOne')[0].sumo.unSelectItem($(this).parent().text());
                $(this).parent().remove();
                $(".dashboard-page.setting-dash .drop-down-here .SumoSelect .SelectBox span").text("Select");
            });

            $(".dropdown-dashboard-global-trends-level .current").parent().find(".current").text("All");

            //remove tab on setting popup
            $(".setting-dash .country").on("click", "a", function () {
                for (var i = 0; i < $(".setting-dash .SumoSelect .optWrapper .options li").length; i++) {
                    var textLi = $(".setting-dash .SumoSelect .optWrapper .options li:nth-child(" + (i + 1) + ") label").text();
                    if (textLi.trim().toLowerCase() === $(this).text().trim().toLowerCase()) {
                        $(".setting-dash .SumoSelect .optWrapper .options li:nth-child(" + (i + 1) + ")").removeClass("selected");
                        return;
                    }
                }
            });

            //==========Search Page============
            // Start range gradient
            if ($(".box-slider").length) {
                (function () {
                    var update_handle_track_pos;

                    update_handle_track_pos = function (slider, ui_handle_pos) {
                        var handle_track_xoffset, slider_range_inverse_width;
                        handle_track_xoffset = -((ui_handle_pos / 100) * slider.clientWidth);
                        $(slider).find(".handle-track").css("left", handle_track_xoffset);
                        slider_range_inverse_width = (100 - ui_handle_pos) + "%";
                        return $(slider).find(".slider-range-inverse").css("width", slider_range_inverse_width);
                    };

                    $("#js-slider").slider({
                        range: "min",
                        max: 100,
                        value: 50,
                        create: function (event, ui) {
                            var slider;
                            slider = $(event.target);
                            slider.find('.ui-slider-handle').append('<span class="dot"><span class="handle-track"></span></span>');
                            slider.prepend('<div class="slider-range-inverse"></div>');
                            slider.find(".handle-track").css("width", event.target.clientWidth);
                            return update_handle_track_pos(event.target, $(this).slider("value"));

                        },
                        slide: function (event, ui) {
                            $("#amount").text(ui.value + "%");
                            return update_handle_track_pos(event.target, ui.value);
                        }
                    });

                    $("#js-slider2").slider({
                        range: "min",
                        max: 100,
                        value: 50,
                        create: function (event, ui) {
                            var slider;
                            slider = $(event.target);
                            slider.find('.ui-slider-handle').append('<span class="dot"><span class="handle-track"></span></span>');
                            slider.prepend('<div class="slider-range-inverse"></div>');
                            slider.find(".handle-track").css("width", event.target.clientWidth);
                            return update_handle_track_pos(event.target, $(this).slider("value"));

                        },
                        slide: function (event, ui) {
                            $("#amount2").text(ui.value + "%");
                            return update_handle_track_pos(event.target, ui.value);
                        }
                    });
                    $("#amount").text($("#js-slider").slider("value") + "%");
                    $("#amount2").text($("#js-slider").slider("value") + "%");

                }).call(this);
            }

            // search page Add Dropdown Query Year
            $(".dropdown-search-year-start").parent().find(".current").text("Select");
            $(".dropdown-search-year-end").parent().find(".current").text("Select");
            if ($(".dash-page.compair").length) {
                $(".dropdown-search-year-start").parent().find(".current").text("2014");
                $(".dropdown-search-year-end").parent().find(".current").text("2015");
                $(".query-reporter-country .drop-full .SumoSelect .CaptionCont span").text("Select");
            }

            //selected show Ranger
            $(".query-request-notification .custommer input").click(function () {
                $(".ranger").addClass("hide");
                $(".ranger").removeClass("show");

                $(".ranger-here").addClass("hide");
                $(".ranger-here").removeClass("show");
            });

            $(".radio-select-show-ranger input").click(function () {
                $(".ranger-one").removeClass("hide");
                $(".ranger-one").addClass("show");
            });


            $(".radio-select-show-ranger-two input").click(function () {
                $(".ranger-two").removeClass("hide");
                $(".ranger-two").addClass("show");
            });

            //hover tooltip
            $(".search-query-page .cover-all-search .hover-tool .main-tool").hover(function () {
                $(this).parent().find('a').addClass("active");
            }, function () {
                $(this).parent().find('a').removeClass("active");
            });

            //==========Data Comparison Detail Page============
            //click tab content Data
            $(".dash-page.compair .tag-menu .main-tag ul li").click(function () {
                $(".dash-page.compair .tag-menu .main-tag ul li").removeClass("active");
                $(this).addClass("active");
            });

            $(".dash-page.compair .tag-menu .main-tag ul li:first-child").click(function () {
                $(".dash-page.compair .group-left .main-import .tab-content-comparison").addClass("hide");
                $(".dash-page.compair .group-left .main-import .cover-import.summary-tab").removeClass("hide");
                $(".irs-grid-text").css("color", "#282828");
                $(".irs-grid-text").css("opacity", 0.5);
                $(".irs-grid-text").css("font-weight", "normal");
                slider.update({
                    from: 8
                });
                var green2Value = 8;
                $(".js-grid-text-" + green2Value).css("color", "#007b77");
                $(".js-grid-text-" + green2Value).css("font-weight", 600);
                $(".js-grid-text-" + green2Value).css("opacity", 1);
            });

            $(".dash-page.compair .tag-menu .main-tag ul li:nth-child(2)").click(function () {
                $(".dash-page.compair .group-left .main-import .tab-content-comparison").addClass("hide");
                $(".dash-page.compair .group-left .main-import .cover-grid").removeClass("hide");
                //			$(".dash-page.compair .group-left .main-import .tab-content-comparison").addClass("hide");
                //			$(".dash-page.compair .group-left .main-import .cover-import.partner-country-tab").removeClass("hide");
                //			$(".irs-grid-text").css("color","#282828");
                //			$(".irs-grid-text").css("opacity",0.5);
                //			$(".irs-grid-text").css("font-weight","normal");
                //			slider.update({
                //				from:8
                //			});
                //			var green2Value = 8;
                //			$(".js-grid-text-"+green2Value).css("color","#007b77");
                //			$(".js-grid-text-"+green2Value).css("font-weight",600);
                //			$(".js-grid-text-"+green2Value).css("opacity",1);
            });

            $(".dash-page.compair .tag-menu .main-tag ul li:nth-child(3)").click(function () {
                $(".dash-page.compair .group-left .main-import .tab-content-comparison").addClass("hide");
                $(".dash-page.compair .group-left .main-import .cover-import.reporter-country-tab").removeClass("hide");
                $(".irs-grid-text").css("color", "#282828");
                $(".irs-grid-text").css("opacity", 0.5);
                $(".irs-grid-text").css("font-weight", "normal");
                slider.update({
                    from: 8
                });
                var green2Value = 8;
                $(".js-grid-text-" + green2Value).css("color", "#007b77");
                $(".js-grid-text-" + green2Value).css("font-weight", 600);
                $(".js-grid-text-" + green2Value).css("opacity", 1);
            });

            $(".dash-page.compair .tag-menu .main-tag ul li:nth-child(4)").click(function () {
                $(".dash-page.compair .group-left .main-import .tab-content-comparison").addClass("hide");
                $(".dash-page.compair .group-left .main-import .cover-import.product-report-tab").removeClass("hide");
                $(".irs-grid-text").css("color", "#282828");
                $(".irs-grid-text").css("opacity", 0.5);
                $(".irs-grid-text").css("font-weight", "normal");
                slider.update({
                    from: 8
                });
                var green2Value = 8;
                $(".js-grid-text-" + green2Value).css("color", "#007b77");
                $(".js-grid-text-" + green2Value).css("font-weight", 600);
                $(".js-grid-text-" + green2Value).css("opacity", 1);
            });

            $(".dash-page.compair .tag-menu .main-tag ul li:nth-child(5)").click(function () {
                $(".dash-page.compair .group-left .main-import .tab-content-comparison").addClass("hide");
                $(".dash-page.compair .group-left .main-import .cover-grid").removeClass("hide");
            });

            $(".dash-page.compair .tag-menu .main-tag ul li:nth-child(6)").click(function () {
                $(".dash-page.compair .group-left .main-import .tab-content-comparison").addClass("hide");
                $(".dash-page.compair .group-left .main-import .cover-main").removeClass("hide");
            });

            //click showless/show more
            $(".dash-page.compair .name-query .head-name a").click(function () {
                if ($(".dash-page.compair .name-query").hasClass("active")) {
                    $(".dash-page.compair .name-query").removeClass("active");
                } else {
                    $(".dash-page.compair .name-query").addClass("active");
                }
            });

            //click expand Filter
            $(".cover-right .notificate.right-filter-content .tool a").click(function () {
                if ($(".cover-right .notificate.right-filter-content").hasClass("active")) {
                    $(".cover-right .notificate.right-filter-content").removeClass("active");
                } else {
                    $(".cover-right .notificate.right-filter-content").addClass("active");
                }
            });

            //click expand Filter
            $(".cover-right .notificate.right-keyfinding-content .tool a").click(function () {
                if ($(".cover-right .notificate.right-keyfinding-content").hasClass("active")) {
                    $(".cover-right .notificate.right-keyfinding-content").removeClass("active");
                } else {
                    $(".cover-right .notificate.right-keyfinding-content").addClass("active");
                }
            });

            //playholder for Dropdown for table tab
            $(".dash-page.compair .group-left .main-import .tab-content-comparison .content-here .tag-table .current").text("Sort by Year");

            //Load Comments data Import / Export Summary json

            //Load Comments data Import / Export Summary json
            // $.getJSON("data/comparisonDetailsTableSummary.json",           


            //click icon controll
            $(".dash-page.compair .cover-grid .list-view .cover-item-new").on("click", ".cover-icon .pen", function () {
                $(".setting-dash.edit-per").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
            });

            $(".dash-page.compair .cover-grid .list-view .cover-item-new").on("click", ".cover-icon .eye", function () {
                indexCollaboratorSelect = $(this).parent().parent().parent().parent().index() + 1;
                $(".setting-dash.info-per").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
            });

            //click delete Collaborator
            var indexCollaboratorSelect = -1;
            $(".dash-page.compair .cover-grid .list-view .cover-item-new").on("click", ".cover-icon .pub", function () {
                indexCollaboratorSelect = $(this).parent().parent().parent().parent().index() + 1;
                $(".setting-dash.remove-popup").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
            });

            //click remove item Collaborator
            $(".setting-dash.remove-popup .btn-bottom .cancel").click(function () {
                hiddenAllPopup();
            });

            //click remove item Collaborator
            $(".setting-dash.remove-popup .btn-bottom .save").click(function () {
                $(".dash-page.compair .cover-grid .list-view .cover-item-new > div:nth-child(" + indexCollaboratorSelect + ")").remove();
                hiddenAllPopup();
            });

            $(".over-lay").click(function () {
                hiddenAllPopup();
            });

            //click button Edit Collaborator Permissions Modal
            $(".btn-bottom .cancel").click(function () {
                hiddenAllPopup();
            });

            //click button cancel on popup setting DashBoard
            $(".setting-dash.dashboard-page .btn-bottom .cancel").click(function () {
                $(".setting-dash.dashboard-page .country").html(oldDataCountrySetting);
                hiddenAllPopup();
            });

            // click change global map
            $(".tab-monthly.global-dark").click(function () {
                $(".date.global-dark").text("February 2016");
            })
            $(".tab-anual.global-dark").click(function () {
                $(".date.global-dark").text("Year 2016");
            })

            //click button ok on popup setting DashBoard
            $(".setting-dash.dashboard-page .btn-bottom .save").click(function () {
                hiddenAllPopup();
            });

            //click button save on popup userInfo Collaborator
            $(".setting-dash.info-per .btn-bottom .save.remove").click(function () {
                $(".setting-dash.remove-popup").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
            });

            $(".setting-dash.info-per .btn-bottom .save.edit").click(function () {
                $(".setting-dash.edit-per").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
            });

            //click Invite button
            $(".cover-grid .filter.grid-ver .btn-filter").click(function () {
                $(".setting-dash.invite-more").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();

            });

            //click save Invite Collaborators
            $(".setting-dash.invite-more .btn-bottom .save").click(function () {
                $(".setting-dash.invite-coll").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
            });

            //click button Save on header
            $(".main-container .cover-left .group-left .right-more a:nth-child(1)").click(function () {
                $(".setting-dash.save-query").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
            });

            //click button Share on header
            var oldShareDataPopup;
            $(".main-container .cover-left .group-left .right-btn .share").click(function () {
                $(".setting-dash.share-pop").removeClass("hide");
                $(".over-lay").addClass("show");
                scrollTopPage();
                oldShareDataPopup = $(".setting-dash.share-pop .country").clone().html();
            });

            //playholder for Dropdown for table tab
            $(".dash-page.compair .group-left .main-import .tab-content-comparison.cover-grid .drop-down-here .current").text("Filter");

            // show 3 tab chart, map, table On tab Summary
            var tabClick = $(".dash-page.compair .body-dash .cover-left .group-left .main-import .cover-import.summary-tab .sub-tag ul");
            //show chart
            tabClick.children("li:nth-child(1)").click(function () {
                $(".main-import .cover-import.summary-tab .tag-chart").removeClass("hide");
                $(".main-import .cover-import.summary-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.summary-tab .tag-table").addClass("hide");
                tabClick.children().removeClass("active");
                $(this).addClass("active");
            })
            //show map
            tabClick.children("li:nth-child(2)").click(function () {
                $(".main-import .cover-import.summary-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.summary-tab .tag-map").removeClass("hide");
                $(".main-import .cover-import.summary-tab .tag-table").addClass("hide");
                tabClick.children().removeClass("active");
                $(this).addClass("active");
            })
            //show table
            tabClick.children("li:nth-child(3)").click(function () {
                $(".main-import .cover-import.summary-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.summary-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.summary-tab .tag-table").removeClass("hide");
                tabClick.children().removeClass("active");
                $(this).addClass("active");
            })

            // show 3 tab chart, map, table On tab partner-country
            var tabClick2 = $(".dash-page.compair .body-dash .cover-left .group-left .main-import .cover-import.partner-country-tab .sub-tag ul");
            //show chart
            tabClick2.children("li:nth-child(1)").click(function () {
                $(".main-import .cover-import.partner-country-tab .tag-chart").removeClass("hide");
                $(".main-import .cover-import.partner-country-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.partner-country-tab .tag-table").addClass("hide");
                tabClick2.children().removeClass("active");
                $(this).addClass("active");
            })
            //show map
            tabClick2.children("li:nth-child(2)").click(function () {
                $(".main-import .cover-import.partner-country-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.partner-country-tab .tag-map").removeClass("hide");
                $(".main-import .cover-import.partner-country-tab .tag-table").addClass("hide");
                tabClick2.children().removeClass("active");
                $(this).addClass("active");
            })
            //show table
            tabClick2.children("li:nth-child(3)").click(function () {
                $(".main-import .cover-import.partner-country-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.partner-country-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.partner-country-tab .tag-table").removeClass("hide");
                tabClick2.children().removeClass("active");
                $(this).addClass("active");
            })

            // show 3 tab chart, map, table On tab reporter-country
            var tabClick3 = $(".dash-page.compair .body-dash .cover-left .group-left .main-import .cover-import.reporter-country-tab .sub-tag ul");
            //show chart
            tabClick3.children("li:nth-child(1)").click(function () {
                $(".main-import .cover-import.reporter-country-tab .tag-chart").removeClass("hide");
                $(".main-import .cover-import.reporter-country-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.reporter-country-tab .tag-table").addClass("hide");
                tabClick3.children().removeClass("active");
                $(this).addClass("active");
            })
            //show map
            tabClick3.children("li:nth-child(2)").click(function () {
                $(".main-import .cover-import.reporter-country-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.reporter-country-tab .tag-map").removeClass("hide");
                $(".main-import .cover-import.reporter-country-tab .tag-table").addClass("hide");
                tabClick3.children().removeClass("active");
                $(this).addClass("active");
            })
            //show table
            tabClick3.children("li:nth-child(3)").click(function () {
                $(".main-import .cover-import.reporter-country-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.reporter-country-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.reporter-country-tab .tag-table").removeClass("hide");
                tabClick3.children().removeClass("active");
                $(this).addClass("active");
            })

            // show 3 tab chart, map, table On tab product-report
            var tabClick4 = $(".dash-page.compair .body-dash .cover-left .group-left .main-import .cover-import.product-report-tab .sub-tag ul");
            //show chart
            tabClick4.children("li:nth-child(1)").click(function () {
                $(".main-import .cover-import.product-report-tab .tag-chart").removeClass("hide");
                $(".main-import .cover-import.product-report-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.product-report-tab .tag-table").addClass("hide");
                tabClick4.children().removeClass("active");
                $(this).addClass("active");
            })
            //show map
            tabClick4.children("li:nth-child(2)").click(function () {
                $(".main-import .cover-import.product-report-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.product-report-tab .tag-map").removeClass("hide");
                $(".main-import .cover-import.product-report-tab .tag-table").addClass("hide");
                tabClick4.children().removeClass("active");
                $(this).addClass("active");
            })
            //show table
            tabClick4.children("li:nth-child(3)").click(function () {
                $(".main-import .cover-import.product-report-tab .tag-chart").addClass("hide");
                $(".main-import .cover-import.product-report-tab .tag-map").addClass("hide");
                $(".main-import .cover-import.product-report-tab .tag-table").removeClass("hide");
                tabClick4.children().removeClass("active");
                $(this).addClass("active");
            })

            function startCustom() {
                $(".irs-grid-text").css("color", "#282828");
                $(".irs-grid-text").css("opacity", 0.5);
                $(".irs-grid-text").css("font-weight", "normal");
            }

            // range year
            if ($(".range-year").length > 0 && $(".range-year").is(":visible")) {
                //var yearArrayRange = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
                var yearArrayRange = config.PERIOD_YEARS;
                var greenBeginText = config.PERIOD_YEARS.length - 1;

                $(".range-year").ionRangeSlider({
                    grid: true,
                    from: greenBeginText,
                    prettify_enabled: false,
                    values: yearArrayRange,
                    onFinish: function (data) {
                        for (var i = 0; i < yearArrayRange.length; i++) {
                            if (data.from_value === yearArrayRange[i]) {
                                startCustom();
                                $(".js-grid-text-" + i).css("color", "#007b77");
                                $(".js-grid-text-" + i).css("opacity", 1);
                                $(".js-grid-text-" + i).css("font-weight", 600);
                            }
                        }
                        if(scope.updateMap){
                            scope.updateMap(data.from_value);
                        }
                    }
                });
                $(".js-grid-text-" + greenBeginText).css("color", "#007b77");
                $(".js-grid-text-" + greenBeginText).css("font-weight", 600);
                $(".js-grid-text-" + greenBeginText).css("opacity", 1);
                // click range detail
                // get detail css

                // click update data
                var slider = $(".range-year").data("ionRangeSlider");


                $(".name-year-box ul li:nth-child(1)").click(function () {
                    slider.update({
                        from: 0
                    });
                    var green2Value = 0;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(2)").click(function () {
                    slider.update({
                        from: 1
                    });
                    var green2Value = 1;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(3)").click(function () {
                    slider.update({
                        from: 2
                    });
                    var green2Value = 2;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(4)").click(function () {
                    slider.update({
                        from: 3
                    });
                    var green2Value = 3;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(5)").click(function () {
                    slider.update({
                        from: 4
                    });
                    var green2Value = 4;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(6)").click(function () {
                    slider.update({
                        from: 5
                    });
                    var green2Value = 5;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(7)").click(function () {
                    slider.update({
                        from: 6
                    });
                    var green2Value = 6;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(8)").click(function () {
                    slider.update({
                        from: 7
                    });
                    var green2Value = 7;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(9)").click(function () {
                    slider.update({
                        from: 8
                    });
                    var green2Value = 8;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                $(".name-year-box ul li:nth-child(10)").click(function () {
                    slider.update({
                        from: 9
                    });
                    var green2Value = 9;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                 $(".name-year-box ul li:nth-child(11)").click(function () {
                    slider.update({
                        from: 10
                    });
                    var green2Value = 10;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                 $(".name-year-box ul li:nth-child(12)").click(function () {
                    slider.update({
                        from: 11
                    });
                    var green2Value = 11;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })
                 $(".name-year-box ul li:nth-child(13)").click(function () {
                    slider.update({
                        from: 12
                    });
                    var green2Value = 12;
                    $(".js-grid-text-" + green2Value).css("color", "#007b77");
                    $(".js-grid-text-" + green2Value).css("font-weight", 600);
                    $(".js-grid-text-" + green2Value).css("opacity", 1);
                })




            }

            //Autocomple ui
            // Custom autocomplete instance.
            $.widget("app.autocomplete", $.ui.autocomplete, {
                // Which class get's applied to matched text in the menu items.
                options: {
                    highlightClass: "ui-state-highlight"
                }
            });

            // Demo data for autocomplete source.

            var projects = [
              {
                  value: "John Doe, lorem_@example.com",
                  name: "John Doe",
                  mail: "lorem_@example.com",
              },
              {
                  value: "John Bills, lorem_@example.com",
                  name: "John Bills",
                  mail: "lorem_@example.com",
              },
              {
                  value: "John Peter, lorem_@example.com",
                  name: "John Peter",
                  mail: "lorem_@example.com",
              }
            ];

            $("#tags").autocomplete({
                highlightClass: "bold-text",
                minLength: 0,
                source: projects
            })
              .autocomplete("instance")._renderItem = function (ul, item) {
                  // Replace the matched text with a custom span. This
                  // span uses the class found in the "highlightClass" option.
                  var re = new RegExp("(" + this.term + ")", "gi"),
                    cls = this.options.highlightClass,
                    template = "<span class='" + cls + "'>$1</span>",
                    label = item.name.replace(re, template),
                    $li = $("<li/>").appendTo(ul);
                  // Create and return the custom menu item content.
                  $("<a/>")
                    .html("<b>" + label + "</b>" + ",  " + "i" + item.mail + "</i>")
                    .appendTo($li);
                  return $li;
              };

            $("#tags2").autocomplete({
                highlightClass: "bold-text",
                minLength: 0,
                source: projects
            })
              .autocomplete("instance")._renderItem = function (ul, item) {
                  // Replace the matched text with a custom span. This
                  // span uses the class found in the "highlightClass" option.
                  var re = new RegExp("(" + this.term + ")", "gi"),
                    cls = this.options.highlightClass,
                    template = "<span class='" + cls + "'>$1</span>",
                    label = item.name.replace(re, template),
                    $li = $("<li/>").appendTo(ul);
                  // Create and return the custom menu item content.
                  $("<a/>")
                    .html("<b>" + label + "</b>" + ",  " + "i" + item.mail + "</i>")
                    .appendTo($li);
                  return $li;
              };

            $(".setting-dash .cover-all .group-input .drop-down-here .arrow.tagShow").click(function () {
                if ($("#ui-id-1").css('display') === 'block') {
                    $('#tags').autocomplete("search", "####");
                } else {
                    $('#tags').autocomplete("search", "");
                }
            })

            // Datepicker
            $("#from").datepicker({
                defaultDate: "+1w",
                dateFormat: "mm/dd/yy",
                numberOfMonths: 1,
                onClose: function (selectedDate) {
                    $("#to").datepicker("option", "minDate", selectedDate);
                }
            }).attr('readonly', 'readonly');
            $("#to").datepicker({
                defaultDate: "+1w",
                dateFormat: "mm/dd/yy",
                numberOfMonths: 1,
                onClose: function (selectedDate) {
                    $("#from").datepicker("option", "maxDate", selectedDate);
                }
            }).attr('readonly', 'readonly');

            // Draw grid
            function make_y_axis() {
                return d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(5)
            }

            //==========QueryList Page============
            // group colum chart Collaborator
            // Draw grid
            function make_y_axis() {
                return d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(5)
            }

            //click Filter For tab Log Activity
            $(".query-page .filter .btn-hide").click(function () {
                $(".query-page .filter").removeClass("active");
            });

            $(".query-page .filter .btn-filter").click(function () {
                $(".query-page .filter").addClass("active");
            });

            //popup Invite Collaborators
            $(".setting-dash.invite-more .group-input .sub").click(function () {
                var textAdd = $(".setting-dash.invite-more .drop-down-here input").val();
                if (textAdd !== "") {
                    var itemAdd = "<a href=\"javascript:;\" class=\"green-box\">" + textAdd + "<span class=\"icons unless\"></span></a>";
                    $(".setting-dash.invite-more .country").append(itemAdd);
                    $(".setting-dash.invite-more .drop-down-here input").val("");
                }

            });
            //remove tag invite
            $(".setting-dash.invite-more .country").on("click", "a", function () {
                $(this).remove();
            });

            //add Tag Invite Popup
            $(".setting-dash.share-pop .sub").click(function () {
                var valInput = $(".setting-dash.share-pop .drop-down-here input").val();
                if (valInput !== "") {
                    valInput = valInput.substring(valInput.indexOf(",") + 1);
                    var row = "<p href=\"javascript:;\" class=\"green-box\">" + valInput + "<a class=\"icons unless\" href=\"javascript:;\"></a></p>";
                    $(".setting-dash.share-pop .country").append(row);
                    $(".setting-dash.share-pop .drop-down-here input").val("");
                }
            });

            //save Invite Popup
            $(".setting-dash.share-pop .btn-bottom .cancel").click(function () {
                $(".setting-dash.share-pop .country").html(oldShareDataPopup);
                hiddenAllPopup();
            });

            //click Ok Button Popup
            $(".setting-dash.invite-coll .btn-bottom a").click(function () {
                hiddenAllPopup();
            });

            //click Filter For tab Log Activity
            $(".cover-main.tab-content-comparison .filter .btn-hide").click(function () {
                $(".cover-main.tab-content-comparison .filter").removeClass("active");
            });

            $(".cover-main.tab-content-comparison .filter .btn-filter").click(function () {
                $(".cover-main.tab-content-comparison .filter").addClass("active");
            });


            // Responses line chart
            function onResizeChart() {
                var chart = $("#barHozChart"),
                  aspect = chart.width() / chart.height(),
                  container = chart.parent();

                var targetWidth = container.width();

                var svgs = $('#barHozChart').find('svg');
                svgs.remove();

                if (!$('#barHozChart')) {
                    //no need to continue is there is no bar graph to draw
                    return;
                }
                reDrawBarHoz();

                var svg = $('#barHozChart').find('svg')[0];
                if (typeof svg !== 'undefined') {
                    svg.setAttribute('width', targetWidth + 'px');
                    svg.setAttribute('height', Math.round(targetWidth / aspect) + 'px');

                    svg.setAttribute('viewBox', '0 0 ' + targetWidth + ' ' + Math.round(targetWidth / aspect));
                    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
                }
            }
        }
    }
})();

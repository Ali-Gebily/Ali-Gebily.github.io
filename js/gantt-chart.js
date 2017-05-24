/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This file contains the gantt chart directive
 * It plots the data and dynamically refresh the chart elements when scope refreshes
 */

app.directive('ganttChart', function($parse, $window){
  return{
    template:"<svg></svg>",
    scope: {
      chartData: '='
    },
    link: function(scope, elem, attrs){
    /**
     * Watch the scope data to be updated
     */
      scope.$watch('chartData', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            plotChart(newValue);
          }
      }, true);

      var FIT_TIME_DOMAIN_MODE = "fit";
      var FIXED_TIME_DOMAIN_MODE = "fixed";
      var lines, lineColors, lineTypes, margin, timeDomainStart, timeDomainEnd,
      timeDomainMode, height, width, tickFormat,x,y,xAxis,yAxis, highlightStartDate,
      highlightEndDate,colorArr;

    /**
     * Function to initialize all chart variables
     * @param {Object} date in string or Date
     */
      function initChartParams(rawData){
        lineColors = {}; /* To assign same colors to similar line types */
        colorArr = d3.scale.category20(); /* Create dynamic colors for line types */
        lines = preparePlottableData(rawData);
        var eob = rawData;
        highlightStartDate = eob.Payments[0].DateRange.Start;
        highlightEndDate = eob.Payments[0].DateRange.End;
        /* Find all unique line types */
        lineTypes = _.chain(lines).pluck('lineType').unique().value();
        margin = {
          top : 30,
          right : 60,
          bottom : 20,
          left : 150
        };
        timeDomainStart = d3.time.day.offset(new Date(),-3);
        timeDomainEnd = d3.time.hour.offset(new Date(),+3);
        timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
        height = $(".gantt-chart").height() - margin.top - margin.bottom-5;
        width = $(".gantt-chart").width() - margin.right - margin.left-5;
        tickFormat = "%b-%d-%Y";
      }

     /**
      * Function to create a unique key
      * @param {Object} date in string or Date
      * @returns {String} unique key
      */
      function keyFunction(d) {
        return d.startDate + d.lineType + d.endDate;
      }
  
     /**
      * Function to create translate css
      * @param {Object} date in string or Date
      * @returns {String} css for translate
      */
      function rectTransform(d) {
        return "translate(" + x(d.startDate) + "," + y(d.lineType) + ")";
      }

      /**
       * Function to prepare data for time domain
       */
      function initTimeDomain() {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (lines === undefined || lines.length < 1) {
              timeDomainStart = d3.time.day.offset(new Date(), -3);
              timeDomainEnd = d3.time.hour.offset(new Date(), +3);
              return;
            }
            lines.sort(function(a, b) {
              return a.endDate - b.endDate;
            });
            timeDomainEnd = lines[lines.length - 1].endDate;
            lines.sort(function(a, b) {
              return a.startDate - b.startDate;
            });
            timeDomainStart = lines[0].startDate;
        }
      }

      /**
       * Function to build the exact array to be plotted
       * @param {Object} raw data from JSON
       * @returns {Array} Array to be plotted in chart
       */
      function preparePlottableData(rawData){
        var dataToPlot = [], postFix = {};
        var lineArr = rawData.Lines;
        for(var i = 0; i < lineArr.length; i++){
          if(postFix[lineArr[i]["LineType"]] === undefined){
            postFix[lineArr[i]["LineType"]] = "";
          }
          var lineStart = new Date(lineArr[i].DateRange.Start);
          var lineEnd = new Date(lineArr[i].DateRange.End);
          var lineId = lineArr[i]["Id"];

          var similarTypes = _.filter(lineArr, function(obj){
            return obj["LineType"] === lineArr[i]["LineType"]; 
          });

          var overlap = _.some(similarTypes, function(obj){
            var objStart = new Date(obj.DateRange.Start);
            var objEnd = new Date(obj.DateRange.End);
            return  postFix[lineArr[i]["LineType"]] !== "" || 
                    (similarTypes.length > 1 && obj["Id"] !== lineId &&
                    ((lineStart >= objStart && lineStart <= objEnd) || 
                    (lineEnd >= objStart && lineEnd <= objEnd)))
          });

          if(overlap){
            if(postFix[lineArr[i]["LineType"]] === ""){
              postFix[lineArr[i]["LineType"]] = 1;
            }else{
              postFix[lineArr[i]["LineType"]]++;
            }
          }

          dataToPlot.push({
            id: lineArr[i]["Id"],
            startDate: new Date(lineArr[i].DateRange.Start),
            endDate: new Date(lineArr[i].DateRange.End),
            description: lineArr[i].Description,
            monthlyRate: lineArr[i]["MonthlyRate"],
            actualLineType: lineArr[i]["LineType"],
            lineType: lineArr[i]["LineType"] + postFix[lineArr[i]["LineType"]]
          });
        }
        return dataToPlot;
      }

      /**
       * Function to initialize axes
       */
      function initAxis() {
        x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
        y = d3.scale.ordinal().domain(lineTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
          .tickSize(8).tickPadding(8);
        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
      }
      
      /**
       * Function to plot chart
       * @param {Object} raw data from JSON
       */
      function plotChart(rawData) {
        if(!rawData){
          return;
        }

        /* Initialize all variables for chart */
        initChartParams(rawData);
        initTimeDomain();
        initAxis();

        /* Start plotting the chart in target svg */
        elem.find('svg').empty();
        var svg = d3.select(elem.find('svg')[0])
        .attr("class", "chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "gantt-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        /* Display the highlight rectangle (shadow area) */
        var left = x(new Date(highlightStartDate));
        var right = x(new Date(highlightEndDate));
        var wid = right - left;
        svg.append("rect")
        .attr("x", left)
        .attr("class","highlight")
        .attr("width", wid)
        .attr("height", height - margin.top - margin.bottom)
        /* Display tooltip on mousehover on shadow highlighted area */
        .on("mousemove", function(d,i) {
            $(".tooltip").remove();
            var verticalSpacing = 20;
            $("<div></div>").appendTo("body")
            .attr("class","tooltip")
            .css("left",d3.event.pageX+"px")
            .css("top",(d3.event.pageY+verticalSpacing)+"px")
            .append("Payment period<br/>"+
                    "Start date: "+ formatDate(new Date(highlightStartDate))+"<br/>"+
                    "End date: "+ formatDate(new Date(highlightEndDate))+"<br/>");
        })
        .on("mouseleave", function(d,i) {
          $(".tooltip").remove();
        });

        /* Draw the chart bars */
        svg.selectAll(".chart")
        .data(lines, keyFunction).enter()
        .append("rect")
        .attr("rx", 5)
        .attr("class","bars")
        .attr("ry", 5)
        .attr("fill", function(d){
          /* Assign a new color to the line types if nothing has been assigned */
          if(lineColors[d.lineType] === undefined){
            var newColor = colorArr(Object.keys(lineColors).length);
            lineColors[d.lineType] = newColor;
            return newColor;
          }
          return lineColors[d.lineType];
        }) 
        .attr("y", 0)
        .attr("transform", rectTransform)
        .attr("height", function(d) { return y.rangeBand(); })
        .attr("width", function(d) { 
          return (x(d.endDate) - x(d.startDate)); 
        })
        /* Display tooltip on mousehover on bars */
        .on("mousemove", function(d,i) {
            $(".tooltip").remove();
            var verticalSpacing = 20;
            $("<div></div>").appendTo("body")
            .attr("class","tooltip")
            .css("left",d3.event.pageX+"px")
            .css("top",(d3.event.pageY+verticalSpacing)+"px")
            .append("Line type: "+d.actualLineType+"<br/>"+
                    "Description: "+d.description+"<br/>"+
                    "Start date: "+formatDate(d.startDate)+"<br/>"+
                    "End date: "+formatDate(d.endDate)+"<br/>"+
                    "Monthly rate: "+d.monthlyRate+"<br/>");
        })
        .on("mouseleave", function(d,i) {
          $(".tooltip").remove();
        });

        /* Draw the charts IDs. Useful for quick reference in printout as well. */
        svg.selectAll(".chart")
        .data(lines, keyFunction).enter()
        .append("text")
        .attr("class", "bartext")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("x", function(d,i) {
          return x(d.endDate) - x(d.startDate);
        })
        .attr("y", function(d,i) {
          return 0;
        })
        .attr("transform", rectTransform)
        .text(function(d){
          return d.id;
        });

        /* Plot x and y axis */
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
        .transition()
        .call(xAxis);
        svg.append("g").attr("class", "y axis").transition().call(yAxis);

        /* Plot the left dotted line. That is payment for start date. */
        svg.append("line")
        .attr("x1", left)
        .attr("y1", 0)
        .attr("x2", left)
        .attr("y2", height - margin.top - margin.bottom)
        .style("stroke-dasharray", "5,5")
        .style("stroke-width", "2")
        .style("stroke", "#505050")
        .style("fill", "none");

        /** Plot the left dotted line labels. That is payment for start date. 
         *  Adjust position for better visibility
         */
        svg.append('text').text("Payment Start")
        .attr('x', left-50)
        .attr('y', -20)
        .attr('fill', '#157EFB');
        svg.append('text').text(formatDate(new Date(highlightStartDate)))
        .attr('x', left-50)
        .attr('y', -7)
        .attr('fill', '#157EFB');

      	///* TEST Plot the left dotted line. That is payment for start date. */
        //svg.append("line")
        //.attr("x1", x(new Date(highlightStartDate)))
        //.attr("y1", 0)
        //.attr("x2", x(new Date(highlightStartDate)))
        //.attr("y2", height - margin.top - margin.bottom)
        //.style("stroke-dasharray", "5,5")
        //.style("stroke-width", "2")
        //.style("stroke", "#505050")
        //.style("fill", "none");

      	///** Plot the left dotted line labels. That is payment for start date. 
        // *  Adjust position for better visibility
        // */
        //svg.append('text').text("Incurred date")
        //.attr('x', left - 50)
        //.attr('y', -20)
        //.attr('fill', '#157EFB');
        //svg.append('text').text(formatDate(new Date(highlightStartDate)))
        //.attr('x', left - 50)
        //.attr('y', -7)
        //.attr('fill', '#157EFB');

        /* Plot the right dotted line. That is for payment end date. */
        svg.append("line")
        .attr("x1", right)
        .attr("y1", 0)
        .attr("x2", right)
        .attr("y2", height - margin.top - margin.bottom)
        .style("stroke-dasharray", "5,5")
        .style("stroke-width", "2")
        .style("stroke", "#505050")
        .style("fill", "none");

        /* Plot the right dotted line labels (top). That is for payment end date. */
        svg.append('text').text("Payment End")
        .attr('x', right-13)
        .attr('y', -20)
        .attr('fill', '#157EFB');
        svg.append('text').text(formatDate(new Date(highlightEndDate)))
        .attr('x', right-13)
        .attr('y', -7)
        .attr('fill', '#157EFB');
      }
      /* Plot the chart with provided data */
      plotChart(scope.chartData);
    }
  };
});
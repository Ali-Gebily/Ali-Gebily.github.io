/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This file contains all calculation stuffs needed to display the
 * calculation table as shown in Excel. Also contains codes for
 * calculation of stuffs in check
 */

app.controller('reportCtrl', function($scope,$rootScope,$interval) {
  /**
   * Detect the emit event
   */
  $rootScope.$on("preparePaymantReport", function(){
    $scope.preparePaymantReport();
  });
  $scope.outside = false; /* To show or hide lines outside payment period */
  /**
   * Function to show or hide lines outside payment period
   */
  $scope.toggleOutSideRange = function(){
    if($scope.outside){
      $scope.outside = false;
    }else{
      $scope.outside = true;
    }
    $("#outSideRangeTable").slideToggle();
  }
  
  /**
   * Function to prepare the data to be displayed on calculation table
   * Build both payment data and the data outside payment period
   */
  $scope.preparePaymantReport = function(){
    var paymentData = [],outSideRangeData=[];
    var eob = $rootScope.eob;
    var lineData = eob.Lines;
    var paymentStart = new Date(eob.Payments[0].DateRange["Start"]);
    var paymentEnd = new Date(eob.Payments[0].DateRange["End"]);
    for(var i=0;i<lineData.length;i++){
      var lineStart = new Date(lineData[i].DateRange["Start"]);
      var lineEnd = new Date(lineData[i].DateRange["End"]);
      /* Check the line's start and end date is within payment period */
      if ((lineStart >= paymentStart && lineStart <= paymentEnd)
			|| (lineEnd >= paymentStart && lineEnd <= paymentEnd)
			|| (lineStart <= paymentStart && lineEnd >= paymentEnd)) {
        /* Adjust the start time and end time when anyone of lineStart or lineEnd is within the payment period */
        var startTime = (lineStart < paymentStart) ? paymentStart : lineStart;
        var endTime = (lineEnd > paymentEnd) ? paymentEnd : lineEnd;
        paymentData.push({
          id : lineData[i]["Id"],
          desc : lineData[i]["Description"],
          rate : lineData[i]["MonthlyRate"],
          startTime : startTime,
          endTime : endTime,
          months : $scope.dateDiff(startTime,endTime,"months",lineData[i]["LineType"]),
          days : $scope.dateDiff(startTime,endTime,"days",lineData[i]["LineType"]),
          net : $scope.calcNet(lineData[i]["MonthlyRate"],$scope.dateDiff(startTime,endTime,"months",lineData[i]["LineType"]),$scope.dateDiff(startTime,endTime,"days",lineData[i]["LineType"]))
        });
      }else{
        /* Build all data that are outside payment range */
        outSideRangeData.push({
          id : lineData[i]["Id"],
          desc : lineData[i]["Description"],
          rate : lineData[i]["MonthlyRate"],
          startTime : lineStart,
          endTime : lineEnd,
          months : $scope.dateDiff(startTime,endTime,"months",lineData[i]["LineType"]),
          days : $scope.dateDiff(startTime,endTime,"days",lineData[i]["LineType"]),
          net : $scope.calcNet(lineData[i]["MonthlyRate"],$scope.dateDiff(startTime,endTime,"months",lineData[i]["LineType"]),$scope.dateDiff(startTime,endTime,"days",lineData[i]["LineType"]))
        });
      }
      
    }
    /* Assign all calculated data in scope */
    $rootScope.paymentData = paymentData;
    $rootScope.outSideRangeData = outSideRangeData;
    $rootScope.$apply();
  }
  
  $rootScope.today = new Date();

  /**
   * Function to calculate the difference between two dates in months and days
   * @param {Date} first date
   * @param {Date} second date
   * @param {String} whether to return number of months or days
   * @returns {Number} number of months or days
   */
  $scope.dateDiff = function(d1, d2, returnType, lineType) {
    var day = 1000 * 60 * 60 * 24;
    if(d1 !== undefined && d2 !== undefined){
      /* For Hospital Confinement return only days */
      if(lineType === "Hospital Confinement"){
        if(returnType === "months"){
          return 0;
        }else{
          var milliDiff = new Date(d2).getTime() - new Date(d1).getTime();
          return Math.floor(milliDiff/day)+1;
        }
      }
      var months;
      var diff = Math.floor(d2.getTime() - d1.getTime());
      var months = Math.floor(diff/(day*30));
      var days = Math.floor(((diff%(day*30))/day))+1;
      if(returnType === "months"){
        return months;
      }else if(returnType === "days"){
        return days;
      }
    }
  }
  /**
   * Function to calculate the checkdate (either mentioned date or todays date)
   * @param {String} mentioned date
   * @returns {String} in MM/dd/yyyy format
   */
  $scope.transferedOn = function(checkDate){
    if(!checkDate){
      return formatDate(new Date());
    }else{
      return formatDate(new Date(checkDate));
    }
  }
  
  /**
   * Function to calculate net amount
   * @param {Number} rate
   * @param {Number} months
   * @param {Number} days
   * @returns {Number} net amount
   */
  $scope.calcNet = function(rate,months,days){
    var net = rate*months + (rate/30)*days;
    return net;
  }
  
  /**
   * Function to calculate the tax amount
   * @param {Object} the data containing tax info
   * @returns {Number} final tax amount
   */
  $scope.calcTax = function(data){
    if(data !== undefined){
      var tax = Math.abs(data.FederalIncomeTax) + Math.abs(data.FICA);
      return tax;
    }else{
      return "";
    }
  }
  
  /**
   * Function to calculate gross amount based on individual net amount
   * @param {Array} money in number
   * @returns {Number} number in dollar and cents
   */
  $scope.calcGross = function(data){
    if(data !== undefined){
      /* Find all nets */
      var nets = _.pluck(data, 'net');
      /* Return sum of all nets */
      return nets.reduce(function (a, b) {return a + b;}, 0);
    }
  }
  
  /**
   * Function to convert money in number to words
   * @param {Number} money in number
   * @returns {String} number in dollar and cents
   */
  $scope.inWords = function(amount){
    return capitalizeFirstLetter(moneyToWord(amount));
  }
  
  /**
   * Function to convert date to specfic format MM/dd/yyyy
   * @param {Date or String} date in string or Date
   * @returns {String} Formatted string in MM/dd/yyyy format
   */
  $scope.formatDate = function(date){
    if(!(date instanceof Date)){
      date = new Date(date);
    }
    return formatDate(date);
  }
});

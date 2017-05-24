/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This file contains code responsible for uploading data with HTML5
 * Also contains code for Drag-drop handling 
 */
var app = angular.module('reportGeneratorApp', []);
app.controller('mainCtrl', function($scope,$rootScope) {
  $rootScope.page=1;
  $scope.previousPage = function(){
    $rootScope.page=$rootScope.page-1;
  }
});

/**
 * Controller for handling all upload file related events
 */
app.controller('uploadCtrl', function($scope,$rootScope) {
  /**
   * Function to convert file size in bytes to KB, MB, GB, TB
   * @param {Number} total size of file in bytes
   * @returns {String} size in bytes
   */
  $scope.bytesToSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return "("+Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]+")";
  };
  
  /**
   * Function to click on the hidden file input
   */
  $scope.selectFile = function(){
    $('#inputFile').click();
  }
  
  /**
   * Function to read the file reference and store it in scope variable
   */
  $scope.readFile = function(files){
    /* Ignore other file types and display message */
    var fileExtn = ".json";
    var reg = new RegExp(fileExtn+"$");
    if(!reg.test(files[0].name.toLowerCase())){
      Materialize.toast("Only JSON file is supported", 4000);
      return;
    }
    $scope.insideDropArea = false;
    $scope.fileDetails={"name": files[0].name,"size": files[0].size};
    $scope.file = files[0];
    $scope.$apply();
  }
  
  /**
   * Function to read the file content
   * Emit the event to invoke preparePaymantReport of reportCtrl
   */
  $scope.generateReport = function(){
    //if ($scope.file.type.indexOf("application/json") == 0) {
      var reader = new FileReader();
      reader.onload = readSuccess;
      function readSuccess(e) {
        $rootScope.eob = JSON.parse(e.target.result).ExplanationOfBenefits;
        $rootScope.$apply();
        $rootScope.$emit("preparePaymantReport", {});
      }
      reader.readAsText($scope.file);
    //}
    $rootScope.page=$rootScope.page+1;
  }

});

/**
 * Directive for drop-box (dotted area) events
 */
app.directive('dropTarget', function () {
  return {
    link: function (scope, element, attrs) {

      /* Fired when mouse enters dotted area with drag */
      element.on('dragenter', function () {
        scope.insideDropArea = true;
        scope.$apply();
      });

      /* Fired when mouse hovers on dotted area with drag */
      element.bind("dragover", function(e) {
        scope.insideDropArea = true;
        scope.$apply();
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }
        if(e.stopPropagation) { 
          e.stopPropagation(); 
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
      });

      /* Fired when mouse leave dotted area with drag */
      element.on('dragleave', function () {
        scope.insideDropArea = false;
        scope.$apply();
      });

      /* Fired when file is dropped on dotted area */
      element.on('drop', function (e) {
        e.preventDefault();  
        e.stopPropagation();
        /* Ignore other file types and display message */
        var fileExtn = ".json";
        var reg = new RegExp(fileExtn+"$");
        if(!reg.test(e.dataTransfer.files[0].name.toLowerCase())){
          Materialize.toast("Only JSON file is supported", 4000);
          return;
        }
        scope.insideDropArea = false;
        scope.fileDetails={"name":e.dataTransfer.files[0].name,"size":e.dataTransfer.files[0].size};
        scope.file = e.dataTransfer.files[0];
        scope.$apply();
        return false;
      });
    }
  };
});

$(document).ready(function() {
  /* Prevent redirection of browser on dropping at white area */
  $("body").on('dragover', function(e){
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
    if(e.stopPropagation) { 
      e.stopPropagation(); 
    }
  });
  $("body").on('drop', function(e){
    if (e.preventDefault) {
      e.preventDefault();
    }
    if(e.stopPropagation) { 
      e.stopPropagation(); 
    }
  });
});

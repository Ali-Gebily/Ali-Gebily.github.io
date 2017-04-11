(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('onFileUpload', onFileUpload);

  onFileUpload.$inject = [];
  /* @ngInject */
  function onFileUpload() {

    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.onFileUpload);
      element.bind('change', onChangeHandler);
    }
  }
})();
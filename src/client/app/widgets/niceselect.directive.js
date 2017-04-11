(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('niceSelect', niceSelectFn);

  niceSelectFn.$inject = ['jquery'];
  /* @ngInject */
  function niceSelectFn(jquery) {

    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      jquery(element).niceSelect();
    }
  }
})();


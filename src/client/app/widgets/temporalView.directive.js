(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('temporalView', niceSelectFn);

  niceSelectFn.$inject = ['jquery'];
  /* @ngInject */
  function niceSelectFn(jquery) {

    var directive = {
      link: link,
      scope: {},
      templateUrl: 'app/widgets/temporal-view.html',
      restrict: 'E'
    };
    return directive;

    function link(scope, element, attrs) {
      scope.isMonthlyView = true;

      scope.makeMonthlyView = function () {
        scope.isMonthlyView = true;
      };

      scope.makeYearlyView = function () {
        scope.isMonthlyView = false;
      };
    }
  }
})();

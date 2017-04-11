(function () {
    'use strict';

    angular
      .module('app.data.comparison')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'datacompare',
              config: {
                  url: '/datacompare',
                  params: { query: null },
                  controller: 'DataComparisonController',
                  controllerAs: 'vm',
                  title: 'Data Comparison',
                  templateUrl: 'app/data-comparison/datacomparison.html',
                  settings: {
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i> Data Comparison'
                  }
              }
          }

        ];
    }
})();

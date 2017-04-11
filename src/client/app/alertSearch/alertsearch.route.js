(function () {
    'use strict';

    angular
      .module('app.alertsearch')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'alertsearch',
              config: {
                  url: '/alertsearch',
                  controller: 'AlertSearchController',
                  controllerAs: 'vm',
                  title: 'Alert Search',
                  templateUrl: 'app/alertSearch/alert-search.html',
                  settings: {
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i> Alert Search'
                  }
              }
          }
        ];
    }
})();

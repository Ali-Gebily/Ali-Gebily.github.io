
(function () {
    'use strict';

    angular
      .module('app.searchdata')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'searchdata',
              config: {
                  url: '/searchdata',
                  params: { query: null },
                  controller: 'SearchDataController',
                  controllerAs: 'vm',
                  title: 'Search Data',
                  templateUrl: 'app/search-data/searchdata.html',
                  settings: {
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i> Search Data'
                  }
              }
          }

        ];
    }
})();

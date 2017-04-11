//

(function() {
  'use strict';

  angular
    .module('app.querylist')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'querylist',
        config: {
          url: '/querylist',
          controller: 'QueryListController',
          controllerAs: 'vm',
          title: 'Query list',
          templateUrl: 'app/query-list/query-list.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> Query List'
          }
        }
      }

    ];
  }
})();

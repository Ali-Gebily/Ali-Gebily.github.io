//

(function() {
  'use strict';

  angular
    .module('app.casestudies')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'casestudies',
        config: {
          url: '/casestudies',
          controller: 'CaseStudiesController',
          controllerAs: 'vm',
          title: 'Resources',
          templateUrl: 'app/case-studies/casestudies.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          }
        }
      }

    ];
  }
})();

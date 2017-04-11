(function() {
  'use strict';

  angular
    .module('app.casedetails')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'casedetails',
        config: {
          url: '/casedetails/:id',
          controller: 'CaseDetailsController',
          controllerAs: 'vm',
          title: 'Case study details',
          templateUrl: 'app/case-details/casedetails.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          }
        }
      }
    ];
  }
})();

//

(function() {
  'use strict';

  angular
    .module('app.speciesdatabase')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'speciesdatabase',
        config: {
          url: '/speciesdatabase',
          controller: 'SpeciesDatabaseController',
          controllerAs: 'vm',
          title: 'Forum',
          templateUrl: 'app/species-database/speciesdatabase.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          }
        }
      }

    ];
  }
})();

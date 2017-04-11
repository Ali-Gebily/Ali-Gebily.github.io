//

(function() {
  'use strict';

  angular
    .module('app.tips')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'tips',
        config: {
          url: '/tips',
          controller: 'TipsController',
          controllerAs: 'vm',
          title: 'Forum',
          templateUrl: 'app/tips/tips.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          }
        }
      }

    ];
  }
})();

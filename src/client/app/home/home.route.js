(function() {
  'use strict';

  angular
    .module('app.home')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'home',
        config: {
          url: '/',
          controller: 'HomeController',
          controllerAs: 'vm',
          title: 'home',
          templateUrl: 'app/home/home.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> Home'
          }
        }
      }

    ];
  }
})();

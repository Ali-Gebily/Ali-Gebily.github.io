(function() {
  'use strict';

  angular
    .module('app.core')
    .run(appRun);

  /* @ngInject */
  function appRun(routerHelper) {
    var otherwise = '/404';
    routerHelper.configureStates(getStates(), otherwise);
  }

  function getStates() {
    return [
      {
        state: '404',
        config: {
          url: '/not-found',
          templateUrl: 'app/core/errors/404.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          title: 'Not found'
        }
      },
      {
        state: '500',
        config: {
          url: '/error',
          templateUrl: 'app/core/errors/500.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          title: 'Whoops!'
        }
      },
      {
        state: '503',
        config: {
          url: '/unavailable',
          templateUrl: 'app/core/errors/503.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          title: 'Service temporarily unavailable'
        }
      }
    ];
  }
})();

//

(function() {
  'use strict';

  angular
    .module('app.forum')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'forum',
        config: {
          url: '/forum?size&page',
          controller: 'ForumController',
          controllerAs: 'vm',
          title: 'Forum',
          templateUrl: 'app/forum/forum.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          }
        }
      }

    ];
  }
})();

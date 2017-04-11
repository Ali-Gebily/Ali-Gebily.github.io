//

(function() {
  'use strict';

  angular
    .module('app.forumpost')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'forumpost',
        config: {
          url: '/forumpost/:id',
          controller: 'ForumPostController',
          controllerAs: 'vm',
          title: 'Forum Post',
          templateUrl: 'app/forum-post/forumpost.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          },
          params: {
          	id: null,
          }
        }
      }

    ];
  }
})();

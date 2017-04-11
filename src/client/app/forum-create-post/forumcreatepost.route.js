//

(function() {
  'use strict';

  angular
    .module('app.forumcreatepost')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'forumcreatepost',
        config: {
          url: '/forumcreatepost/:id',
          controller: 'ForumCreatePostController',
          controllerAs: 'vm',
          title: 'Forum Post',
          templateUrl: 'app/forum-create-post/forumcreatepost.html',
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

//

(function() {
  'use strict';

  angular
    .module('app.profile')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'profile',
        config: {
          url: '/profile',
          controller: 'ProfileController',
          controllerAs: 'vm',
          title: 'Profile',
          templateUrl: 'app/profile/profile.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          }
        }
      }

    ];
  }
})();

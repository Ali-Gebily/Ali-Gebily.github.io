//

(function() {
  'use strict';

  angular
    .module('app.publicprofile')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'publicprofile',
        config: {
            url: '/publicprofile/:username',
          controller: 'PublicProfileController',
          controllerAs: 'vm',
          title: 'User Profile',
          templateUrl: 'app/public-profile/publicprofile.html',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> User Profile'
          },
          params: {
              username: null,
          }
        }
      }

    ];
  }
})();

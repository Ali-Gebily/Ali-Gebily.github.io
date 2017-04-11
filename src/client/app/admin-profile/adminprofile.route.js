//

(function () {
    'use strict';

    angular
      .module('app.adminprofile')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'adminprofile',
              config: {
                  url: '/adminprofile',
                  controller: 'AdminProfileController',
                  controllerAs: 'vm',
                  title: 'Admin Page',
                  templateUrl: 'app/admin-profile/adminprofile.html',
                  settings: {
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i> User Profile'
                  }
              }
          }

        ];
    }
})();

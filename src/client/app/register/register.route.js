(function () {
    'use strict';

    angular
      .module('app.register')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'register',
              config: {
                  url: '/register',
                  controller: 'RegistrationController',
                  controllerAs: 'vm',
                  title: 'register',
                  templateUrl: 'app/register/register.html',
                  settings: {
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i> Register'
                  }
              }
          },
          {
              state: 'forgotPassword',
              config: {
                  url: '/forgotPassword?passwordResetKey',
                  controller: 'passwordResetController',
                  controllerAs: 'vm',
                  title: 'Forgot Password',
                  templateUrl: 'app/register/passwordReset.html',
                  params: {
                      passwordResetKey: null
                  }
              }
          }
        ];
    }
})();

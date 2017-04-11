(function () {
    'use strict';

    angular
      .module('app.alertdetail')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'alertdetail',
              config: {
                  url: '/alertdetail',
                  params: { alert: null },
                  controller: 'AlertDetailController',
                  controllerAs: 'vm',
                  title: 'Alert Detail',
                  templateUrl: 'app/alertdetail/alertdetail.html',
                  settings: {
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i> Alert Detail'
                  }
              }
          }
        ];
    }
})();

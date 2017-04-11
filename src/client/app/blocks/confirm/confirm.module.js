(function () {
    'use strict';

    angular
      .module('blocks.confirm', ['angular-confirm'])
      .run(appRun);
    appRun.$inject = ['$confirmModalDefaults'];
    /* @ngInject */
    function appRun($confirmModalDefaults) {
        $confirmModalDefaults.templateUrl = 'app/blocks/confirm/confirm.html';
        $confirmModalDefaults.defaultLabels.title = 'Confirmation';
        $confirmModalDefaults.defaultLabels.ok = 'Delete';
        $confirmModalDefaults.defaultLabels.cancel = 'Cancel';
    }
})();

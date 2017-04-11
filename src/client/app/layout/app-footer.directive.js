(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('appFooter', appFooter);

  /* @ngInject */
  function appFooter() {
    var directive = {
      bindToController: true,
      controller: FooterController,
      controllerAs: 'fvm',
      restrict: 'E',
      scope: {
        'footerline': '='
      },
      templateUrl: 'app/layout/footer.html'
    };

    FooterController.$inject = ['$scope', 'util'];

    /* @ngInject */
    function FooterController($scope, util) {
      var fvm = this;
      $scope.login = function() {
          util.login();
      }
    }

    return directive;
  }
})();

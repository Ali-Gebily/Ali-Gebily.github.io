(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('confirm', confirm);

  confirm.$inject = [];
  /* @ngInject */
  function confirm() {

    var directive = {
      link: link,
      restrict: 'E',
      scope: {
        showConfirm: '=',
        onDelete: '&'
      },
      controller: ConfirmController,
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/widgets/confirm.tpl.html'
    };
    return directive;

    function link(scope, element, attrs) { }
  }

  ConfirmController.$inject = ['$scope'];

  function ConfirmController($scope) {
    var vm = this;


    vm.delete = function() {
      vm.onDelete()();
    }
  }

})();
(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('message', confirm);

  confirm.$inject = [];
  /* @ngInject */
  function confirm() {

    var directive = {
      link: link,
      restrict: 'E',
      scope: {
        showMessage: '=',
        messageTitle: '=',
        messageText: '=',
        onDelete: '&'
      },
      controller: MessageController,
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/widgets/message.tpl.html'
    };
    return directive;

    function link(scope, element, attrs) { }
  }

  MessageController.$inject = ['$scope'];

  function MessageController($scope) {
    var vm = this;
  }

})();
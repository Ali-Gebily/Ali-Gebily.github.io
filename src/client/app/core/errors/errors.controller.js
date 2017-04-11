(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ErrorController', ErrorController);

  /* @ngInject */
  function ErrorController() {
    var vm = this;
    vm.title = 'Not Found';
    vm.errorDetail = {
      errorDetail: '',
      email: '',
      message: ''
    };

    vm.submitError=function(){
      // submit the form with errorDetail
    }; 
  }
})();


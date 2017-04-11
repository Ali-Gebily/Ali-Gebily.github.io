(function () {
  'use strict';

  angular
    .module('app.publicprofile')
    .controller('PublicProfileController', PublicProfileController);

  PublicProfileController.$inject = ['$state', '$stateParams', '$window', 'userService'];
  /* @ngInject */
  function PublicProfileController($state, $stateParams, $window, userService) {
    var vm = this;
    vm.title = 'User Profile';
    vm.vertica = {
      connectionString: '',
      netLevelPer: '',
      volLevelPer: '',
      countryCode: '',
      commodityCodes: ''
    }; 

    vm.sendInvitation=function(){
      // delete
    };

    userService.getUser($stateParams.username)
        .then(function (user) {
            vm.user = user;
            if (!user.publicFields) {
                user.publicFields = "";
            }

            // setup the view model containg the list of available properties.
            var publicFieldList = vm.user.publicFields.split(",");
            vm.publicFields = {};

            angular.forEach(publicFieldList, function (field) {
                vm.publicFields[field] = true;
            });
        });
  }
})();


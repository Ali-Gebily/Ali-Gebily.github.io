/*
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for password reset page.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular
      .module('app.register')
      .controller('passwordResetController', RegistrationController);

    RegistrationController.$inject = ['$scope', '$state', '$stateParams', 'util', 'userService', 'currentUser'];
    /* @ngInject */
    function RegistrationController($scope, $state, $stateParams, util, userService, currentUser) {
        if (currentUser.userInfo.isLoggedIn) {
            $state.go('dashboard');
        }

        var vm = this;
        vm.login = util.login;
        vm.passwordResetKey = $stateParams.passwordResetKey;
        vm.user = {};
        vm.scope = $scope;
        $scope.user = vm.user;

        vm.requestPasswordReset = function () {
            if (!isValid()) {
                return;
            }

            userService.requestPasswordReset(vm.username).then(function (result) {
                util.showMessage(vm, 'Success', 'Password reset request has been submitted. You should get email with instructions shortly.');
            },
            function (error) {
                util.showMessage(vm, 'Unable to request password reset', error.message);
            });
        };

        vm.resetPassword = function () {
            if (!isValid()) {
                return;
            }

            userService.resetPassword(vm.passwordResetKey, vm.user.password).then(function (result) {
                util.showMessage(vm, 'Success', 'Password has been reset. Please login using updated password.');
            },
            function (error) {
                util.showMessage(vm, 'Unable to reset password', error.message);
            });
        };

        function isValid() {
            angular.forEach($scope.myForm.$error.required, function (field) {
                field.$setDirty();
            });

            return $scope.myForm.$valid;
        };
    }
})();

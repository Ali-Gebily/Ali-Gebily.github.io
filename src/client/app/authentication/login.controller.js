/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * The credentials and social network login controller.
 *
 * @author TCSCODER, TCSCODER
 * @version 1.1
 * 
 * Changes in 1.1:
 *   Living Progress - Build - WWF - Data Download and Security Enhancements v1.0:
 *   https://www.topcoder.com/challenge-details/30056081
 */
(function () {
    'use strict';

    angular
      .module('app.auth')
      .controller('LoginController', LoginController);

    LoginController.$inject = ['$uibModalInstance', '$state', '$window', '$rootScope', 'config', 'currentUser', 'util'];
    /* @ngInject */
    function LoginController($uibModalInstance, $state, $window, $rootScope, config, currentUser, util) {
        var vm = this;
        vm.title = 'Login';
        vm.username = null;
        vm.password = null;
        vm.errorMessage = null;

        function onLoginSucceded() {
            vm.closeModal();
            $state.reload();
        };

        function onLoginFailed(error) {
            if (error.status === 401) {
                vm.errorMessage = "Invalid Username or Password!";
            }
            else {
                vm.errorMessage = error.message;
            }
        };

        this.forgotPassword = function () {
            util.showMessage(vm, "test tit", "test mes");
        };

        this.login = function() {
            vm.errorMessage = null;
            currentUser.login(vm.username, vm.password).then(onLoginSucceded, onLoginFailed);
        }

        this.externalLogin = function (providerName) {
            var redirectUri = location.protocol + '//' + location.host + '/app/authentication/authcomplete.html';
            var externalProviderUrl = config.REST_API_BASE_URL +
                "/ExternalLogin?provider=" + providerName + "&redirect_uri=" + redirectUri;
            window.$windowScope = vm;
            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        this.authCompletedCB = function (fragment) {
            currentUser.updateApiToken(fragment.token).then(onLoginSucceded, onLoginFailed);
        }

        vm.closeModal = function closeModal() {
            $window.removeLoginBackDrop();
            $uibModalInstance.dismiss();
            $rootScope.isLoginPopupDisplayed = false;
        };

        vm.cancel = function () {
            vm.closeModal();
            if ($state.is('profile') || $state.is('querylist')) {
                $state.go('dashboard');
            }
        };

        this.register = function register() {
            vm.closeModal();
            util.register();
        };
    }
})();

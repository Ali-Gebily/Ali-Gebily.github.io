/*
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for user registration page.
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
      .module('app.register')
      .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['$scope', 'logger', '$state', 'config', 'util', 'currentUser', 'lookupService'];
    /* @ngInject */
    function RegistrationController($scope, logger, $state, config, util, currentUser, lookupService) {
        var vm = this;
        vm.title = 'Register';
        vm.userDetails = {};
        vm.user = {};
        vm.register = register;
        vm.login = login;
        vm.scope = $scope;
        vm.scope.user = vm.user;

        vm.countries = {};
        lookupService.getAllCountries().then(function (data) {
            vm.countries = data;
            // validate fields to display which ones are required.
            isValid();
        });

        vm.externalLogin = function (providerName) {
            var redirectUri = location.protocol + '//' + location.host + '/app/authentication/authcomplete.html';
            var externalProviderUrl = config.REST_API_BASE_URL +
                "/ExternalLogin?provider=" + providerName + "&redirect_uri=" + redirectUri;
            window.$windowScope = vm;
            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        this.authCompletedCB = function (fragment) {
            currentUser.updateApiToken(fragment.token).then(onLoginSucceded, onLoginFailed);
        }

        function onLoginSucceded() {
            //vm.closeModal();
            $state.go('dashboard');
        };

        function onLoginFailed(error) {
            util.showMessage(vm, 'Unable to register user', error.message);
        };

        function register() {
            if (!isValid()) {
                return;
            }

            currentUser.register(vm.user).then(function (result) {
                util.scrollToTop();
                $state.go('dashboard');
            },
            function (error) {
                util.showMessage(vm, 'Unable to register user', error.message);
            });
        }

        function isValid() {
            angular.forEach($scope.myForm.$error.required, function (field) {
                field.$setDirty();
            });

            return $scope.myForm.$valid;
        };

        function login() {
            util.login();
        }
    }
})();

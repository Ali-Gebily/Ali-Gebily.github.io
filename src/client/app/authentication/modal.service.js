/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * The login modal service.
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

    angular.module('app.auth').factory('loginModal', LoginModal);

    LoginModal.$inject = ['$uibModal', '$state', '$window', '$rootScope', 'currentUser'];
    /* @ngInject */
    function LoginModal($uibModal, $state, $window, $rootScope, currentUser) {
        return function () {
            if (!$rootScope.isLoginPopupDisplayed) {
                currentUser.logout();
                $rootScope.isLoginPopupDisplayed = true;
                $window.showLoginBackDrop();
                var instance = $uibModal.open({
                    templateUrl: 'app/authentication/login.html',
                    controller: 'LoginController',
                    controllerAs: 'lvm',
                    size: 'lg'
                }).closed.then(function () {
                    $window.removeLoginBackDrop();
                    $rootScope.isLoginPopupDisplayed = false;
                });

                return instance;
            }
        };
    }
})();

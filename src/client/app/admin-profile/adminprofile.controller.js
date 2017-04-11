/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for admin settings page.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular
      .module('app.adminprofile')
      .controller('AdminProfileController', AdminProfileController);

    AdminProfileController.$inject = ['$scope', '$state', '$window', 'util', 'currentUser', 'alertService'];
    /* @ngInject */
    function AdminProfileController($scope, $state, $window, util, currentUser, alertService) {
        var vm = this;

        function init() {
            $scope.userInfo = currentUser.userInfo;

            vm.title = 'Admin Page';
            vm.alertConfiguration = {};

            if (!currentUser.userInfo.isLoggedIn) {
                util.login();
                return;
            }

            if (!currentUser.userInfo.isAdmin) {
                $state.go('home');
                return;
            }

            // load alert config
            alertService.getConfiguration().then(function (config) {
                vm.alertConfiguration = config;
            }, util.handleHttpError);
        };

        vm.save = function () {
            alertService.saveConfiguration(vm.alertConfiguration).then(function (config) {
                alert('Configuration saved successfully!');
            }, util.handleHttpError);
        };

        vm.loadFromVertica = function () {
            alertService.loadFromVertica().then(function () {
                alert('Data from Vertica was successfully loaded!');
            }, util.handleHttpError);
        };

        init();
    }
})();

/*
 * Copyright (c) 2017, TopCoder, Inc. All rights reserved.
 */
/**
 * A directive to display user panel.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('userPanel', userPanel);

    userPanel.$inject = [];
    /* @ngInject */
    function userPanel() {

        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                currentPage: '=',
                defaultPageSize: '=',
                totalItems: '@',
                showEllipsis: '@',
                onChangePage: '=',
                changePage: '&'
            },
            controller: userPanelController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'app/widgets/user-panel.html'
        };
        return directive;

        function link(scope, element, attrs) { }
    }

    userPanelController.$inject = ['$scope', '$state', 'currentUser', 'util'];

    function userPanelController($scope, $state, currentUser, util) {
        var vm = this;
        vm.login = function () {
            util.login();
        };
        vm.logout = function () {
            currentUser.logout();
            $state.reload();
        };
        vm.register = function () {
            util.register();
        };

        $scope.userInfo = currentUser.userInfo;
    }
})();
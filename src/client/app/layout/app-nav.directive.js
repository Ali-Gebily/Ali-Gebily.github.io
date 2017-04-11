/*
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * The directive for navigation panel.
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
      .module('app.layout')
      .directive('appNav', appNav);

    /* @ngInject */
    function appNav() {
        var directive = {
            bindToController: true,
            transclude: true,
            controller: NavController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                menuItem: '@'
            },
            templateUrl: 'app/layout/nav.html'
        };

        NavController.$inject = ['$scope', '$state', 'util', 'storage', 'currentUser'];

        /* @ngInject */
        function NavController($scope, $state, util, storage, currentUser) {
            $scope.userInfo = currentUser.userInfo;
            var vm = this;
        }

        return directive;
    }
})();


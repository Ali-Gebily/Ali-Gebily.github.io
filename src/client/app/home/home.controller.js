/*
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * The Home controller.
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
      .module('app.home')
      .controller('HomeController', HomeController);

    HomeController.$inject = ['$state', 'util'];

    /* @ngInject */
    function HomeController($state, util) {
        var vm = this;
        vm.news = {
            title: 'WWF',
            description: 'WWF SPA App tp detect fish illegal fish trade'
        };
        vm.title = 'Home';

        vm.register = util.register;
        vm.login = function () {
            util.login();
        };
    }
})();

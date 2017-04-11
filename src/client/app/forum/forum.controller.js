/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for forum page.
 *
 * @author TCSCODER, TCSCODER
 * @version 1.1
 * 
 * Changes in 1.1:
 *   Living Progress - Build - WWF - Data Download and Security Enhancements v1.0:
 *   https://www.topcoder.com/challenge-details/30056081
 */(function () {
    'use strict';

    angular
      .module('app.forum')
      .controller('ForumController', ForumController);

    ForumController.$inject = ['$q', '$location', '$scope', '$state', '$window', 'ForumService', 'currentUser', 'ForumPostService'];
    /* @ngInject */
    function ForumController($q, $location, $scope, $state, $window, ForumService, currentUser, ForumPostService) {
        $scope.userInfo = currentUser.userInfo;

        var vm = this;
        vm.threads = [];
        vm.currentPageThreads = [];
        vm.hotTopics = [];
        vm.showHotTopics = false;
        vm.showLatestPosts = false;
        vm.latestPosts = [];
        vm.showFilterTags = false;
        // pagination parameters
        vm.currentPage = parseInt($state.params.page) || 1;
        vm.pageSize = parseInt($state.params.size) || 5; 
        vm.startItem = 1;
        vm.endItem = 1;

        // tags data: partner countries
        vm.partnerCountries = [
          { name: 'Lorem Ipsum Tag', selected: true },
          { name: 'Lorem Ipsum Tag', selected: true },
          { name: 'Lorem Ipsum Tag', selected: true },
          { name: 'Lorem Ipsum Country', selected: false },
          { name: 'Camera and Video Trapping (5)', selected: false },
          { name: 'Satellite Data (1)', selected: false },
          { name: 'Tracking (3)', selected: false },
          { name: 'Scientific Research (12)', selected: false }
        ];
        vm.rmPartnerCountry = rmPartnerCountry;       

        activate();

        function rmPartnerCountry(index) {
            vm.partnerCountries.splice(index, 1);
        }
       

        /**
         * .activate() initializes the page: 
         *    - Initializes the profile section
         *    - Fetches the forum thread data, the hot topic data 
         *      and latest post data (from dev server (json files))
         */
        function activate() {
            $window.profilePageInit();

            var promises = [getForumThreads(), getHotTopics(), getLatestPosts()];
            return $q.all(promises).then(function () {
                vm.showPage(vm.currentPage, vm.pageSize);
            });
        }

        /**
         * .getForumThreads(): fetches threads
        *     (loaded from the dev server (json file))
         * 
         * @return {Array} array of thread
         */
        function getForumThreads() {
            return ForumService.forumThreads({}).then(function (data) {
                vm.threads = data.items;
                vm.totalItems = vm.threads.length;

                for (var i = 0; i < vm.threads.length; i++) {
                    var thread = vm.threads[i];
                    thread.when = moment(thread.sys.createdAt).fromNow();

                    // Get last comment
                    var comments = thread.fields.comments;

                    if (comments && comments.length > 0) {
                        var lastComment = _.orderBy(comments, ['sys.updatedAt'], ['desc'])[0];
                        lastComment.when = moment(lastComment.sys.updatedAt).fromNow();
                        thread.lastComment = lastComment;

                        ForumPostService.setAvatar(lastComment, comments);
                    }

                    // Handle author avatar.
                    ForumPostService.setAvatar(thread, vm.threads);
                }

                return vm.threads;
            });
        }

        /**
         * .getHotTopics(): fetches hot topics data
         * 
         * @return {Array} array of hot topics
         */
        function getHotTopics() {
            return ForumService.hotTopics({}).then(function (data) {
                vm.hotTopics = data.items;

                _.each(vm.hotTopics, function (post) {
                    post.when = moment(post.sys.updatedAt).fromNow();
                });
                return vm.hotTopics;
            });
        }

        /**
         * .getLatestPosts(): fetches latest post data
        *     (loaded from the dev server (json file))
         * 
         * @return {Array} array of posts
         */
        function getLatestPosts() {
            return ForumService.latestPosts({}).then(function (data) {
                vm.latestPosts = data.items;

                _.each(vm.latestPosts, function (post) {
                    post.when = moment(post.sys.updatedAt).fromNow();
                });

                return vm.latestPosts;
            });
        }

        vm.showPage = function (pageNumber, pageSize) {
            if(vm.currentPage != pageNumber || vm.pageSize != pageSize){
              $state.go($state.current, {page:pageNumber, size:pageSize});
            }
            var skipCount = pageSize * (pageNumber - 1);
            var takeCount = pageSize;
            vm.currentPageThreads = _.take(_.drop(vm.threads, skipCount), takeCount);
            vm.startItem = skipCount + 1;
            vm.endItem = vm.startItem + pageSize - 1;

            if (vm.endItem > vm.totalItems) {
                vm.endItem = vm.totalItems;
            }
        }

        vm.refreshPage = function () {
            activate();
        }
    }
})();

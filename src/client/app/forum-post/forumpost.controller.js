/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for post viewing page.
 *
 * @author TCSCODER, TCSCODER, TCSCODER
 * @version 1.2
 * 
 * Changes in 1.1:
 * Implemented requirements for 'WWF - Results Display and Forum Publishing v1.0' challenge:
 * https://www.topcoder.com/challenge-details/30055325
 * 
 * Changes in 1.2:
 *   Living Progress - Build - WWF - Data Download and Security Enhancements v1.0:
 *   https://www.topcoder.com/challenge-details/30056081
 */
(function () {
    'use strict';

    angular
      .module('app.forumpost')
      .controller('ForumPostController', ForumPostController);

    ForumPostController.$inject = ['$q', '$location', '$scope', '$state', '$stateParams', '$window', 'util', 'ForumPostService', 'ContentfulService', 'currentUser'];
    /* @ngInject */
    function ForumPostController($q, $location, $scope, $state, $stateParams, $window, util, ForumPostService, ContentfulService, currentUser) {
        var vm = this;

        vm.showingProfile = true;
        vm.showHotTopics = false;
        vm.hotTopics = [];
        vm.showLatestPosts = false;
        vm.latestPosts = [];
        // pagination parameters
        vm.totalItems = 2;
        vm.currentPage = 1;
        vm.comments = [];
        vm.newComment = "";

        $scope.user = currentUser.userInfo;

        /**
         * .activate(): Initializes the profile section
         */
        function activate() {
            var promises = [getPost($stateParams.id)];
            return $q.all(promises).then(function () {
            });
        }

        /**
        * .deletePost(): deletes a post
        */
        vm.deletePost = function () {
            return ContentfulService.deletePost($stateParams.id)
              .then(function (data) {
                  $location.path("forum");
              });
        }

        /**
        * .deleteComment(): deletes a comment
        */
        vm.deleteComment = function () {
            return ContentfulService.deleteComment(vm.commentToDelete.sys.id, vm.commentToDelete.parentId)
              .then(function (data) {

                  _.remove(vm.comments, function (comment) {
                      return comment.sys.id === vm.commentToDelete.sys.id;
                  });

                  vm.showConfirm = false;
              });
        }

        /**
        * .updateComment(): Updates a comment
        */
        vm.updateComment = function (comment) {
            return ContentfulService.updateComment(comment)
              .then(function (data) {
                  // refresh the page.
                  comment.edit = !comment.edit
              });
        }

        /**
         * .createComment(): Creates a new comment
         */
        vm.createComment = function () {
            var result = ContentfulService.createComment(vm.newComment, $stateParams.id, $stateParams.id, $scope.user.username)
              .then(function (data) {
                  // refresh the page.
                  retrieveComment(data.sys.id, vm.post);
              }, util.handleHttpError);

            // reset the comment text
            vm.newComment = "";
            return result;
        }

        /**
         * .createNestedComment (): Creates a new comment
         */
        vm.createNestedComment = function (comment) {
            var result = ContentfulService.createComment(comment.newComment, $stateParams.id, comment.sys.id, $scope.user.username)
              .then(function (data) {
                  // refresh the page.
                  retrieveComment(data.sys.id, comment);
              }, util.handleHttpError);

            // reset the reply comment text
            comment.newComment = "";
            return result;
        }

        vm.trimTag = function (tag) {
            return util.trimLength(tag, 50);
        }

        vm.back = function(){
            $window.history.back();
        }

        /**
            * .getPost(): fetches post data
            * 
            * @return {Object} post
            */
        function getPost(id) {
            return ForumPostService.getPost(id).then(function (data) {
                vm.post = data;

                // Get the author avatar.
                if (vm.post.fields.authorAvatar) {
                    ForumPostService.getAvatar(vm.post.fields.authorAvatar.sys.id).then(function (data) {
                        vm.authorAvatar = data.fields.file.url;
                    });
                } else {
                    vm.authorAvatar = $scope.user.photo;
                }

                // Get the forum post graphic.
                if (vm.post.fields.graphic) {
                    ForumPostService.getGraphic(vm.post.fields.graphic.sys.id).then(function (data) {
                        vm.graphic = data;
                    });
                }

                // Get the forum post Map.
                if (vm.post.fields.map) {
                    ForumPostService.getGraphic(vm.post.fields.map.sys.id).then(function (data) {
                        vm.map = data;
                    });
                }

                // Retrieve details for each comment.
                _.each(vm.post.fields.comments, function (comment) {
                    retrieveComment(comment.sys.id, vm.post);
                });


                // Retrieve attachments.
                _.each(vm.post.fields.attachments, function (attachment) {
                    retrieveAttachment(attachment);
                });

                return vm.post;
            });
        }

        function retrieveComment(id, parent) {
            ForumPostService.getComment(id).then(function (comment) {
                comment.when = moment(comment.sys.createdAt).fromNow();
                comment.parentId = parent.sys.id;
                comment.parentAuthor = parent.fields.author;

                // maintain sorted list of comments.
                var index = _.sortedIndexBy(vm.comments, comment, function (c) { return c.sys.createdAt; });
                vm.comments.splice(index, 0, comment);

                // Get the avatar for the comment author.
                ForumPostService.setAvatar(comment, vm.comments);

                // Get nested comments.
                if (comment.fields.comments) {
                    _.each(comment.fields.comments, function (c) {
                        retrieveComment(c.sys.id, comment);
                    });
                }
            });
        }

        function retrieveAttachment(attachment) {
            ForumPostService.getGraphic(attachment.sys.id).then(function (file) {
                attachment.file = file.fields.file;
            });
        }

        activate();
    }
})();


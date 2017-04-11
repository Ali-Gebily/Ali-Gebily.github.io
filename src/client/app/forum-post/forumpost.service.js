/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service for forum posts management.
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

    angular.module('app.forumpost').factory('ForumPostService', ForumPostService);

    ForumPostService.$inject = ['$http', 'exception', 'contentful', 'userService'];
    /* @ngInject */
    function ForumPostService($http, exception, contentful, userService) {

        var service = {
            getComment: getComment,
            getPost: getPost,
            getAvatar: getAvatar,
            getGraphic: getGraphic,
            setAvatar: setAvatar
        };

        return service;

        function getGraphic(id) {
            return contentful.asset(id).then(success).catch(fail);
        }

        function getAvatar(id) {
            return contentful.asset(id).then(success).catch(fail);
        }

        function getPost(id) {
            return contentful.entry(id).then(success).catch(fail);
        }

        function getComment(id) {
            return contentful.entry(id).then(success).catch(fail);
        }

        function setAvatar(entry, collection) {
            if (entry.fields && entry.fields.authorAvatar) {
                getAvatar(entry.fields.authorAvatar.sys.id).then(function (avatar) {
                    if (avatar) {
                        var thread = _.find(collection, function (t) {
                            return t.fields.authorAvatar && t.fields.authorAvatar.sys.id == avatar.sys.id;
                        });
                        thread.avatar = avatar.fields.file.url;
                    }
                });
            } else {
                // If there is no author avatar in contentful, try to get the user's photo from the DB.
                var author = entry.author || (entry.fields ? entry.fields.author : undefined);
                if (author) {
                    userService.getUserPhoto(author).then(function (photo) {
                        if (photo) {
                            _.each(collection, function (t) {
                                var auth = t.author || (t.fields ? t.fields.author : undefined);
                                if (auth == author) {
                                    t.avatar = photo;
                                }
                            });
                        }
                    });
                }
            }
        }

        function success(response) {
            return response.data;
        }

        function fail(e) {
            return exception.catcher('XHR Failed to get dashboard information')(e);
        }
    }
})();
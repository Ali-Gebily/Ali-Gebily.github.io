(function () {
  'use strict';

  angular.module('app.forum').factory('ForumService', ForumService);

  ForumService.$inject = ['$http', 'exception', 'contentful'];
  /* @ngInject */
  function ForumService($http, exception, contentful) {
    var contentType = {
      parent : "Parent"
    }

    var service = {
      forumThreads: forumThreads, 
      hotTopics: hotTopics, 
      latestPosts: latestPosts
    };

    return service;

    function forumThreads(query) {
        var backendQuery = query || {};
        backendQuery.content_type = contentType.parent;
        if (!backendQuery.order) {
            backendQuery.order = "-sys.updatedAt";
        }

        return contentful.entries($.param(backendQuery)).then(success).catch(fail);
    }

    function hotTopics(query) {
        var backendQuery = query || {};
        backendQuery.content_type = contentType.parent;
        backendQuery.order = "-fields.commentCount"; // minus prefix if for descending.
        backendQuery.limit = 3;

        return contentful.entries($.param(backendQuery)).then(success).catch(fail);
    }

    function latestPosts(query) {
        var backendQuery = query || {};
        backendQuery.content_type = contentType.parent;
        backendQuery.order = "-sys.updatedAt"; // minus prefix if for descending.
        backendQuery.limit = 3;
        return contentful.entries($.param(backendQuery)).then(success).catch(fail);
    }

    function success(response) {
      return response.data;
    }

    function fail(e) {
      return exception.catcher('XHR Failed to get dashboard information')(e);
    }
  }
})();


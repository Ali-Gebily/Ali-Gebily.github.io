/*
 * Copyright (C) 2016-2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * Service that wraps requests to the Contentful API in the backend.
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

	angular.module('app.contentful', []).factory('ContentfulService', ContentfulService);

	ContentfulService.$inject = ['$http', 'exception', 'serverProxy'];
	/* @ngInject */
	function ContentfulService($http, exception, serverProxy) {

		var baseUrl = "/contentful";

		var service = {
			createComment: createComment,
			createPost: createPost,
			updateComment: updateComment,
			deleteComment: deleteComment,
			deletePost: deletePost,
			updatePost: updatePost
		};

		return service;

		function createComment(comment, postId,  parentId, author) {
			return serverProxy.makeRequest({
				method: 'POST',
				url: baseUrl + '/comments?postId=' + postId + '&parentId=' + parentId,
				data: {
					fields: {
					    comment: { "en-US": comment },
					    author: { "en-US": author },
						authorId: { "en-US": 2 }
					}
				}
			});
		}

		function deleteComment(id, parentId) {
		  return serverProxy.makeRequest({
		    method: 'DELETE',
		    url: baseUrl + '/comments/' + id + '?parentId=' + parentId,
		  }).then(success, fail);
		}

		function updateComment(comment) {
		  return serverProxy.makeRequest({
		    method: 'PUT',
		    url: baseUrl + '/comments/' + comment.sys.id,
		    data: '"' + comment.fields.comment + '"' // needs quotes for web api to parse it
		  }).then(success, fail);
		}

		function createPost(request) {
			return serverProxy.makeRequest({
				method: 'POST',
				url: baseUrl + '/posts',
				data: request
			}).then(success, fail);
		}

		function updatePost(request) {
		  return serverProxy.makeRequest({
		    method: 'PUT',
		    url: baseUrl + '/posts',
		    data: request
		  }).then(success, fail);
		}

		function deletePost(id) {
		  return serverProxy.makeRequest({
		    method: 'DELETE',
		    url: baseUrl + '/posts/' + id
		  }).then(success, fail);
		}

		function success(response) {
			return response.data;
		}

		function fail(e) {
			return exception.catcher('XHR Failed to get contentful information')(e);
		}
	}
})();
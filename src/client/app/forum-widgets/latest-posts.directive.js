(function () {
	'use strict';

	angular
      .module('app.forum.widgets')
      .directive('latestPosts', latestPosts);

	/* @ngInject */
	function latestPosts() {
		var directive = {
			bindToController: true,
			controller: LatestPostsController,
			controllerAs: 'vm',
			restrict: 'E',
			scope: {},
			templateUrl: 'app/forum-widgets/latest-posts.html'
		};

		LatestPostsController.$inject = ['$scope', 'ForumService'];

		/* @ngInject */
		function LatestPostsController($scope, ForumService) {
			var vm = this;

			// Load the Hot Topics.
			getLatestPosts();

			/**
			* .getLatestPosts(): fetches latest post data
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
		}

		return directive;
	}
})();
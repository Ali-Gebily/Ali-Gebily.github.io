(function() {
  'use strict';

  angular.module('app.forumpost', [
    'app.core',
    'app.contentful',
    'app.widgets',
    'blocks.exception',
    'blocks.logger',
    'blocks.router',
    'ui.router',
    'app.forum.widgets'
  ]);

    angular
    .module('app.forumpost')
    .config(function (contentfulProvider, config) {
        contentfulProvider.setOptions({
          space: config.contentfulSpace,
          accessToken: config.contentfulAccessToken
    });
});
})();

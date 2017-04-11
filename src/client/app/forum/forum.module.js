(function() {
  'use strict';

  angular.module('app.forum', [
		'app.core',
    'app.widgets',
    'blocks.exception',
    'blocks.logger',
    'blocks.router',
    'ui.router',
    'contentful'
  ]);

  angular
  .module('app.forum')
  .config(function (contentfulProvider, config) {
		contentfulProvider.setOptions({
			space: config.contentfulSpace,
			accessToken: config.contentfulAccessToken
    });
  });

})();

(function () {
  'use strict';

  angular.module('app.dashboard').factory('DashboardService', DashboardService);

  DashboardService.$inject = ['$http', 'exception'];
  /* @ngInject */
  function DashboardService($http, exception) {

    var service = {      
      newCaseStudies: newCaseStudies,
      parseFeed: parseFeed
    };

    return service;

    function newCaseStudies(query) {

      var backendQuery = query || {};

      return $http.get('/api/newcasestudies', {params: {query: backendQuery}})
        .then(success)
        .catch(fail);
    }

    function success(response) {
      return response.data;
    }

    function fail(e) {
      return exception.catcher('XHR Failed to get dashboard information')(e);
    }

    function parseFeed(url) {
      var query = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from feednormalizer where url="' + url + '"') + '&format=json';
      return $http.get(query)
        .then(success)
        .catch(fail);
    }
  }
})();


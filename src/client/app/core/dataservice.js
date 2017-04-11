(function () {
    'use strict';

    angular
      .module('app.core')
      .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'contentful'];
    /* @ngInject */
    function dataservice($http, $q, exception, contentful) {
        var datacompareQuery = {};

        var service = {
            getAsset: getAsset,
            getBestPractices: getBestPractices,
            getCaseStudy: getCaseStudy,
            getCaseStudies: getCaseStudies,
            getLatestCaseStudies: getLatestCaseStudies,
            getHelpfulLinks: getHelpfulLinks,
            lineData: lineData,
            alertComments: alertComments,
            dataComparison: dataComparison,
            setDataCompareQuery: setDataCompareQuery,
            myQueryList: myQueryList,            
            monthlyLineData: monthlyLineData,
            yearlyLineData: yearlyLineData
        };

        return service;

        function getAsset(id) {
            var deferred = $q.defer();

            contentful
              .asset(id)
              .then(success, error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(response) {
                deferred.reject('Contentful error: ' + response.status);
            }

            return deferred.promise;
        }

        function getBestPractices() {
            var deferred = $q.defer();

            contentful
              .entries('&content_type=bestPractice')
              .then(success, error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(response) {
                deferred.reject('Contentful error: ' + response.status);
            }

            return deferred.promise;
        }

        function getCaseStudy(id) {
            var deferred = $q.defer();

            contentful
              .entry(id)
              .then(success, error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(response) {
                deferred.reject('Contentful error: ' + response.status);
            }

            return deferred.promise;
        }

        function getCaseStudies() {
            var deferred = $q.defer();

            contentful
              .entries('&content_type=caseStudy')
              .then(success, error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(response) {
                deferred.reject('Contentful error: ' + response.status);
            }

            return deferred.promise;
        }

        function getLatestCaseStudies(count) {
            var deferred = $q.defer();

            contentful
              .entries('&content_type=caseStudy&order=-sys.updatedAt&limit=' + count)
              .then(success, error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(response) {
                deferred.reject('Contentful error: ' + response.status);
            }

            return deferred.promise;
        }

        function getHelpfulLinks() {
            var deferred = $q.defer();

            contentful
              .entries('&content_type=helpfulLinks')
              .then(success, error);

            function success(response) {
                deferred.resolve(response.data);
            }

            function error(response) {
                deferred.reject('Contentful error: ' + response.status);
            }

            return deferred.promise;
        }

        function setDataCompareQuery(newQuery) {
            datacompareQuery = newQuery;
        }

        function lineData() {
            return $http.get('/api/linedata')
              .then(success)
              .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return exception.catcher('XHR Failed for line data fetch')(e);
            }
        }

        function alertComments(alertId) {
            return $http.get('/api/alertcomments/'.concat(alertId))
              .then(success)
              .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return exception.catcher('XHR Failed while fetching alert comments')(e);
            }

        }

        function dataComparison() {
            datacompareQuery = datacompareQuery || {};

            return $http.get('/api/datacomparison', { params: { query: datacompareQuery } })
              .then(success)
              .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return exception.catcher('XHR Failed for data comparison data')(e);
            }
        }

        function myQueryList(searchQuery) {
            var myListQuery = searchQuery || {};
            return $http.get('/api/myquerylist', { params: { query: myListQuery } })
              .then(success)
              .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return exception.catcher('XHR Failed for my query list')(e);
            }
        }  

        function monthlyLineData(month) {
            return $http.get('/api/monthlylinedata')
              .then(success)
              .catch(fail);

            function success(response) {
                return response.data[month];
            }

            function fail(e) {
                return exception.catcher('XHR Failed for line data fetch')(e);
            }
        }

        function yearlyLineData(year) {
            return $http.get('/api/yearlineData')
              .then(success)
              .catch(fail);

            function success(response) {
                var pty = 'year'.concat(year);
                return response.data[pty];
            }

            function fail(e) {
                return exception.catcher('XHR Failed for line data fetch')(e);
            }
        }
    }
})();

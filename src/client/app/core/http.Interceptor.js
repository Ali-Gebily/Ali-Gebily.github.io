(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('httpInterceptor', httpInterceptor);

    httpInterceptor.$inject = ['$q', 'spinnerService'];
    /* @ngInject */
    function httpInterceptor($q, spinnerService) {
        var numLoadings = 0;
        var _cancelCallback = function () {
            for (var index in _requestConfigCache) {
                var config = _requestConfigCache[index];
                if (config.timeoutDefer) {
                    config.timeoutDefer.resolve();
                    config.manuallyCancelled = true;
                }
            }
        }
        var _requestConfigCache = []
        return {
            request: function (config) {
                var canceler = $q.defer();
                config.timeout = canceler.promise;
                config.timeoutDefer = canceler;
                _requestConfigCache.push(config);
                spinnerService.show(_cancelCallback);
                return config || $q.when(config)
            },
            response: function (response) {
                _requestConfigCache.splice(_requestConfigCache.indexOf(response.config), 1);
                if (_requestConfigCache.length === 0) {
                    spinnerService.hide();
                }
                return response || $q.when(response);

            },
            responseError: function (response) {
                _requestConfigCache.splice(_requestConfigCache.indexOf(response.config), 1);
                if ( _requestConfigCache.length === 0) {
                    spinnerService.hide();
                }
                if (response.config.manuallyCancelled) {
                    return $q.reject({status: -100, error: 'Request is cancelled manually'});
                } else {
                    return $q.reject(response);
                }
            }
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('spinnerService', spinnerService);

    spinnerService.$inject = [];
    /* @ngInject */
    function spinnerService() {
        var spinner = $('.spinner-container');
        var cancelButton = spinner.find('a');
        cancelButton.on('click', function (event) {
            if (_cancelCallback) {
                _cancelCallback();
                _cancelCallback = null;
            }
        })
        var _loading = false;
        var _cancelCallback = null;
        hide();
        return {
            show: show,
            hide: hide,
            isLoading: function () {
                return _loading;
            }
        };
        function show(cancelCallback) {
            _loading = true;
            spinner.show(); 
            _cancelCallback = cancelCallback;
        };
        function hide(params) {
            _loading = false;
            spinner.hide(); 
            _cancelCallback = null;
        };

    }
})();
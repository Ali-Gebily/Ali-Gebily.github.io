/*
 * Copyright (c) 2017, TopCoder, Inc. All rights reserved.
 */
/**
 * A directive to handle enter key press.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    angular.module('app.core').directive('enterKey', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.enterKey);
                    });

                    event.preventDefault();
                }
            });
        };
    });
})();
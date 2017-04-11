/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * A directive to check that confirmation password matches password.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    angular.module('app.core').directive('onlyDigits', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                function inputValue(val) {
                    if (val) {
                        var digits = val.replace(/[^0-9.,]/g, '');

                        if (digits !== val) {
                            ctrl.$setViewValue(digits);
                            ctrl.$render();
                        }
                        return digits;
                    }
                    return undefined;
                }
                ctrl.$parsers.push(inputValue);
            }
        };
    });
})();
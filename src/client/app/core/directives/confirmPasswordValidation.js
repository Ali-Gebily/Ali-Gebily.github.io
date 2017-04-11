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
    angular.module('app.core').directive('confirmPasswordValidation', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {
                ngModel.$parsers.unshift(function (value) {
                    ngModel.$setValidity('passwordMismatch', scope.user.password === value);
                    return value;
                });
            }
        };
    });
})();
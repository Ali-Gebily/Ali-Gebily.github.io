/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * A directive that handles image uploads.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    angular.module('app.core').directive("imageSelect", function () {
        return {
            link: function ($scope, el) {
                el.bind("change", function (e) {
                    var file = (e.srcElement || e.target).files[0];
                    $scope.getFile(file);
                });
            }
        }
    });
})();

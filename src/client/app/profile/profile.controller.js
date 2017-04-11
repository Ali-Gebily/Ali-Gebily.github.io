/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for user profile page.
 *
 * @author TCSCODER
 * @version 1.0
 */
(function () {
    'use strict';

    angular
      .module('app.profile')
      .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$state', '$window', 'currentUser', 'userService', 'lookupService', 'imageUpload'];
    /* @ngInject */
    function ProfileController($scope, $state, $window, currentUser, userService, lookupService, imageUpload) {
        $scope.userInfo = currentUser.userInfo;
        var passwordMask = "******";

        var vm = this;
        vm.title = 'Profile';
        vm.search = search;

        $scope.viewMode = true;
        userService.reloadCurrentUser().then(function (user) {
            $scope.user = user;
            adjustUserFields(user);

            // setup the view model containg the list of available properties.
            var publicFieldList = user.publicFields.split(",");
            vm.publicFields = {};

            angular.forEach(publicFieldList, function (field) {
                vm.publicFields[field] = true;
            });
        });

        $scope.countries = {};
        lookupService.getAllCountries().then(function (data) {
            $scope.countries = data;
        });

        function search() {
            $state.go('dashboard');
        }

        function adjustUserFields(user) {
            if (!user.publicFields) {
                user.publicFields = "";
            }
        };

        $scope.edit = function () {
            $scope.userBackup = JSON.parse(JSON.stringify($scope.user));
            toggleEditMode(true);
        };

        $scope.save = function () {
            if (!isValid()) {
                return;
            }
            
            if ($scope.user.password === passwordMask) {
                // mark as not changed
                $scope.user.password = null;
            }

            fillPublicFields();

            userService.update($scope.user).then(function (result) {
                $scope.user = currentUser.get();
                adjustUserFields($scope.user);
                toggleEditMode(false);
            }, function (error) {
                alert(error.message);
            });
        };

        $scope.cancel = function () {
            $scope.user = $scope.userBackup;
            toggleEditMode(false);
        };

        function toggleEditMode(isEditMode) {
            $scope.viewMode = !isEditMode;
            $scope.editMode = isEditMode;
        };

        $scope.getFile = function (file) {
            imageUpload.readAsDataUrl(file, $scope)
                .then(function (result) {
                    $scope.user.photo = result;
                });
        };

        function isValid() {
            angular.forEach($scope.myForm.$error.required, function (field) {
                field.$setDirty();
            });

            return $scope.myForm.$valid;
        };

        $scope.passwordFocused = function () {
            if (!$scope.user.password && !$scope.user.confirmPassword) {
                $scope.user.password = passwordMask;
                $scope.user.confirmPassword = passwordMask;
            }
        };

        $scope.getCountryName = function (countryId) {
            for (var index in $scope.countries) {
                if ($scope.countries[index].id == countryId) {
                    return $scope.countries[index].name;
                }
            }
        };

        function fillPublicFields() {
            var allFields = ["name", "title", "organization","country","phone", "email", "twitter" ];
            var publicFieldList = [];

            angular.forEach(allFields, function (field) {
                if (vm.publicFields[field]) {
                    publicFieldList.push(field);
                }
            });
            
            $scope.user.publicFields = publicFieldList.join();
        }
    }
})();


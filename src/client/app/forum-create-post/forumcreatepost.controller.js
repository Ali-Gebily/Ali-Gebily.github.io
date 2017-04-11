/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * Controller for post creating page.
 *
 * @author TCSCODER, TCSCODER
 * @version 1.1
 * 
 * Changes in 1.1:
 * Implemented requirements for 'WWF - Results Display and Forum Publishing v1.0' challenge:
 * https://www.topcoder.com/challenge-details/30055325
 */
(function () {
    'use strict';

    angular
      .module('app.forumcreatepost')
      .controller('ForumCreatePostController', ForumCreatePostController);

    ForumCreatePostController.$inject = ['$scope', '$stateParams', '$window', '$q', '$location', 'util', 'ForumPostService', 'ContentfulService', 'currentUser', 'tradeDataService'];
    /* @ngInject */
    function ForumCreatePostController($scope, $stateParams, $window, $q, $location, util, ForumPostService, ContentfulService, currentUser, tradeDataService) {
        var vm = this;

        vm.existingFields;
        vm.deleteExistingChart = false;
        vm.deleteExistingMap = false;
        vm.textEditorContent = "";
        vm.selectedFile = undefined;
        vm.graphicFile;

        vm.uploadedFiles = [];
        vm.uploadFile = uploadFile;
        vm.cancelFileUpload = cancelFileUpload;
        vm.modalHidden = true;
        vm.isEdit = $stateParams.id != undefined;

        activate();

        /**
         * .activate(): Initializes the profile section
         */
        function activate() {
            $scope.user = currentUser.userInfo;
            if (!$scope.user.isLoggedIn) {
                util.login();
                return;
            }

            if (vm.isEdit) {
                ForumPostService.getPost($stateParams.id).then(function (post) {
                    vm.title = post.fields.title;
                    vm.description = post.fields.description;
                    vm.tags = post.fields.tags;
                    vm.existingFields = post.fields;
                    loadAllTags();
                });
            }
            else {
                loadAllTags();
            }
        }

        function loadAllTags() {
            vm.allTags = [];
            $q.all([
                tradeDataService.getAllCommodities(),
                tradeDataService.getAllCountries()
            ]).then(function (data) {
                // commodity tags
                for (var index in data[0]) {
                    var commodityName = util.trimLeft(data[0][index].name, ' -0123456789');
                    vm.allTags.push(commodityName);
                }

                // country tags
                for (var index in data[1]) {
                    var countryName = data[1][index].fullName;
                    vm.allTags.push(countryName);
                }

                util.stylizeMultiSelectBox('#SelectBoxTags', '.query-forum-tags', 'Select');
            }, util.handleHttpError);
        }

        vm.trimTag = function (tag) {
            return util.trimLength(tag, 50);
        };

        /**
         * .selectFile(): method used for the input type file
         *    It is used with the onFileUpload directive. The directive listens to 
         *    file attachments, and trigger this method that binds the attached
         *    file to the vm.attachment variable (so the file name can appear in the 
         *    input field)
         */
        $scope.selectFile = function (event) {
            populateFile(event, function (file) {
                vm.selectedFile = {
                    name: file.name,
                    type: file.type
                };
                readFileAsBlob(file, function (base64Content) {
                    vm.selectedFile.base64Content = base64Content
                });
            });
        }

        /**
             * .selectGraphic(): method used for the graphic input type file.
             */
        $scope.selectGraphic = function (event) {
            populateFile(event, function (file) {
                vm.graphicFile = {
                    name: file.name,
                    type: file.type
                };
                readFileAsBlob(file, function (base64Content) {
                    vm.graphicFile.base64Content = base64Content
                });
            });
        }

        function readFileAsBlob(file, callback) {
            // Read the file content into a blob.
            var blob = file.slice(0, file.size);
            var reader = new FileReader();

            // If we use onloadend, we need to check the readyState.
            reader.onloadend = function (evt) {
                if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                    var base64Content = btoa(evt.target.result);
                    callback(base64Content);
                }
            };

            reader.readAsBinaryString(blob);
        }

        /**
             * .populateFile(): method used to populate a destination object with the input file.
             */
        function populateFile(event, callback) {
            var files = event.target.files;
            if (typeof files != "undefined" && typeof files[0] != "undefined") {
                callback(files[0])
                $scope.$apply();
            }
        }

        function uploadFile() {
            if (typeof vm.selectedFile === "undefined") {
                return;
            }

            vm.uploadedFiles.push(vm.selectedFile);
            vm.selectedFile = undefined;
        }

        function cancelFileUpload(index) {
            vm.uploadedFiles.splice(index, 1);
        }

        /**
         * .toggleModal(): used to show / hide the 'Create post' confirmation
         *    window. 
         *    It simply toggle the vm.modalHidden (Boolean) variable
         */
        $scope.toggleModal = function () {
            var errorMessage;
            if (!vm.title) {
                errorMessage = 'Please enter post title.';
            }
            else if (!vm.description) {
                errorMessage = 'Please enter post description.';
            }
            if (errorMessage) {
                showMessage('Validation Error', errorMessage);
                return;
            }

            vm.modalHidden = !vm.modalHidden;
        }

        /**
        * .createPost(): creates a new Post in Contentful.
        */
        $scope.createPost = function () {
            var fields = {
                title: { "en-US": vm.title },
                description: { "en-US": vm.description },
                tags: { "en-US": vm.tags },
                author: { "en-US": $scope.user.username },
                authorId: { "en-US": 2 }
            };

            if (vm.isEdit) {
                if (!vm.deleteExistingChart) {
                    fields.graphic = { "en-US": vm.existingFields.graphic };
                }

                if (!vm.deleteExistingMap) {
                    fields.map = { "en-US": vm.existingFields.map };
                }
            }

            var request = {
                entry: {
                    fields: fields
                },
                graphic: vm.graphicFile,
                attachments: vm.uploadedFiles
            }

            if (vm.isEdit) {
                request.entry.sys = { id: $stateParams.id };
                ContentfulService.updatePost(request).then(redirect, showErrorMessge);
            } else {
                ContentfulService.createPost(request).then(redirect, showErrorMessge);
            }
        }

        function redirect() {
            $location.path("forum");
        }

        function showErrorMessge(e) {
            showMessage("Error", e.message.message);
        };

        function showMessage(title, message) {
            vm.messageTitle = title;
            vm.messageText = message;
            vm.showMessage = true;
        }
    }
})();
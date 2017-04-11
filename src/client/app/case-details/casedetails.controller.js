(function () {
    'use strict';

    angular
      .module('app.casedetails')
      .controller('CaseDetailsController', CaseStudiesDetailsController);

    CaseStudiesDetailsController.$inject = ['$q', '$state', '$stateParams', '$window', 'dataservice', 'moment'];
    /* @ngInject */
    function CaseStudiesDetailsController($q, $state, $stateParams, $window, dataservice, moment) {
        var vm = this;

        vm.casestudyData = {};
        vm.imgData = {};
        vm.getCaseStudy = getCaseStudy;
        vm.getDisplayDate = getDisplayDate;

        activate();

        /**
         * .activate() initializes the page: 
         *    - Initializes the profile section
         *    - Fetches the case study data 
         */
        function activate() {
            $window.profilePageInit();

            // go to 404 in case there is no id param in the URL
            if ($stateParams.id === "") {
                $state.go('404');
            }

            var promises = [getCaseStudy($stateParams.id)];
            return $q.all(promises).then(function () {
            });
        }

        /**
         * .getCaseStudy(): fetches case study data from Contentful 
         *    and sets the data to vm.casestudyData
         * 
         * @params {String} id Contentful entry id
         * @return {Object} a case study object
         */
        function getCaseStudy(id) {
            return dataservice.getCaseStudy(id).then(function (data) {
                angular.copy(data, vm.casestudyData);
                getAsset(data.fields.headerImage.sys.id);
                return vm.casestudyData;
            });
        }

        /**
         * .getAsset()
         *    Gets the case study image data and set it to the vm.imgData variable
         *    (Only the image id is returned when getting case studies, and not 
         *    the image url and title)
         * 
         * @params {String} id Contentful asset (image) id 
         */
        function getAsset(id) {
            return dataservice.getAsset(id).then(function (data) {
                angular.copy(data, vm.imgData);
                return vm.casestudyData;
            });
        }

        /**
         * .getDisplayDate()
         *    Convert a standard date string (format ISO YYYY-MM-DDTHH:mm-ss:SS)
         *    to a date string that follow format: MMM D, YYYY
         *    Example output: "Jul 11, 2016"
         * 
         * @params {String}
         * @return {String} 
         */
        function getDisplayDate(d) {
            return moment(d, "YYYY-MM-DDTHH:mm-ss:SS").format("MMM D, YYYY");
        }
    }
})();


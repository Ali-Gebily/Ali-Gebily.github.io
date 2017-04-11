(function () {
  'use strict';

  angular
    .module('app.casestudies')
    .controller('CaseStudiesController', CaseStudiesController);

  CaseStudiesController.$inject = ['$q', '$state', '$window', 'dataservice', 'moment'];
  /* @ngInject */
  function CaseStudiesController($q, $state, $window, dataservice, moment) {
    var vm = this;

    vm.casestudyData = []; 
    vm.getCaseStudies = getCaseStudies; 
    vm.getDisplayDate = getDisplayDate; 
    // pagination parameters
    vm.totalItems = 4; 
    vm.currentPage = 1; 

    activate();

    /**
     * .activate() initializes the page: 
     *    - Initializes the profile section
     *    - Fetches the case studies data 
     */
    function activate() {
      $window.profilePageInit();

      var promises = [getCaseStudies()];
      return $q.all(promises).then(function () {
      });
    }

    /**
     * .getCaseStudies(): fetches case studies data from Contentful 
     *    and sets the data to vm.casestudyData
     * 
     * @return {Array} array of cases study
     */
    function getCaseStudies() {
      return dataservice.getCaseStudies().then(function(data) {
        vm.casestudyData = data;
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

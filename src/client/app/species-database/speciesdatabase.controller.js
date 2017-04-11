(function () {
  'use strict';

  angular
    .module('app.speciesdatabase')
    .controller('SpeciesDatabaseController', SpeciesDatabaseController);

  SpeciesDatabaseController.$inject = ['$state', '$window', 'dataservice'];
  /* @ngInject */
  function SpeciesDatabaseController($state, $window, dataservice) {
    var vm = this;

    vm.helpfulLinks = []; 
    vm.getHelpfulLinks = getHelpfulLinks; 
    vm.downloadableResource = downloadableResource; 
    // pagination parameters
    vm.totalItems = 4; 
    vm.currentPage = 1; 

    activate();

    /**
     * .activate() initializes the page: 
     *    - Initializes the profile section
     *    - Fetches the helpful links data 
     */
    function activate() {
      vm.getHelpfulLinks(); 
      $window.profilePageInit();
    }

    function downloadableResource(link) {
      var trimed = link.trim(); 
      return trimed.substring(trimed.length-4, trimed.length) === ".pdf"; 
    }

    /**
     * .getCaseStudies(): fetches helpful links data from Contentful 
     *    and sets the data to vm.getHelpfulLinks
     * 
     * @return {Array} array of helpful link
     */
    function getHelpfulLinks() {
      return dataservice.getHelpfulLinks().then(function(data) {
        vm.helpfulLinks = data;
        return vm.helpfulLinks;
      });
    }
  }
})();

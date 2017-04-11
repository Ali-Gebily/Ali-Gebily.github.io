(function () {
  'use strict';

  angular
    .module('app.tips')
    .controller('TipsController', TipsController);

  TipsController.$inject = ['$state', '$window', 'dataservice'];
  /* @ngInject */
  function TipsController($state, $window, dataservice) {
    var vm = this;

    vm.bestPracticesData = []; 
    vm.getBestPractices = getBestPractices; 
    // pagination parameters
    vm.totalItems = 4; 
    vm.currentPage = 1; 

    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });

    activate();

    /**
     * .activate() initializes the page: 
     *    - Initializes the profile section
     *    - Fetches the best practices data 
     */
    function activate() {
      vm.getBestPractices(); 
      $window.profilePageInit();
    }

    /**
     * .getCaseStudies(): fetched best practices data from Contentful 
     *    and sets the data to vm.getBestPractices
     * 
     * @return {Array} array of best practice
     */
    function getBestPractices() {
      return dataservice.getBestPractices().then(function(data) {
        vm.bestPracticesData = data;        
        _.forEach(vm.bestPracticesData.items, function(item) {
            item.fields.content =  marked(item.fields.content);
          });
        return vm.bestPracticesData;
      });
    }
  }
})();


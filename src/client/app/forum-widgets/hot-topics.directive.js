(function () {
    'use strict';

    angular
      .module('app.forum.widgets')
      .directive('hotTopics', hotTopics);

    /* @ngInject */
    function hotTopics() {
        var directive = {
            bindToController: true,
            controller: HotTopicsController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {},
            templateUrl: 'app/forum-widgets/hot-topics.html'
        };

        HotTopicsController.$inject = ['$scope', 'ForumService'];

        /* @ngInject */
        function HotTopicsController($scope, ForumService) {
            var vm = this;
            
            // Load the Hot Topics.
            getHotTopics();

            /**
            * .getHotTopics(): fetches hot topics data
            * 
            * @return {Array} array of hot topics
            */
            function getHotTopics() {
                return ForumService.hotTopics({}).then(function (data) {
                    vm.hotTopics = data.items;

                    _.each(vm.hotTopics, function (post) {
                        post.when = moment(post.sys.updatedAt).fromNow();
                    });
                    return vm.hotTopics;
                });
            }
        }

        return directive;
    }
})();
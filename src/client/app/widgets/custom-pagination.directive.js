(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('customPagination', customPagination);

    customPagination.$inject = [];
    /* @ngInject */
    function customPagination() {

        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                currentPage: '=',
                defaultPageSize: '=',
                totalItems: '@',
                showEllipsis: '@',
                onChangePage: '=',
                changePage: '&'
            },
            controller: PaginationController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'app/widgets/custom-pagination.tpl.html'
        };
        return directive;

        function link(scope, element, attrs) { }
    }

    PaginationController.$inject = ['$scope'];

    function PaginationController($scope) {
        var vm = this;
        vm.previousPage = previousPage;
        vm.nextPage = nextPage;
        vm.setPage = setPage;
        vm.pageSize = (!vm.defaultPageSize) ? 5 : vm.defaultPageSize; // Default value
        $('.dropdownPageSize').val(vm.pageSize);

        vm.getPageNumbers = function () {
            var pageNumbers = [];
            if (vm.totalItems > 0) {
                var n = vm.totalItems / vm.pageSize;
                var numberOfPages = parseInt(n);

                if (n > numberOfPages) {
                    numberOfPages++;
                }

                var startIndex, endIndex;
                if (numberOfPages <= 9) {
                    startIndex = 1;
                    endIndex = numberOfPages;
                }
                else {
                    startIndex = vm.currentPage - 4;
                    endIndex = vm.currentPage + 4;
                    if (startIndex < 1) {
                        endIndex += (1 - startIndex);
                        startIndex = 1;
                    }
                    if (endIndex > numberOfPages) {
                        startIndex -= (endIndex - numberOfPages);
                        endIndex = numberOfPages;
                    }
                }

                for (var index = startIndex; index <= endIndex; index++) {
                    pageNumbers.push(index);
                }
            }
            return pageNumbers;
        }

        function previousPage() {
            if (vm.currentPage != 1) {
                setPage(vm.currentPage - 1);
            }
        }

        function nextPage() {
            var totalPages = vm.totalItems / vm.pageSize;
            if (vm.currentPage < totalPages) {
                setPage(vm.currentPage + 1);
            }
        }

        function setPage(index) {
            vm.currentPage = index;
            if (vm.onChangePage) {
                vm.onChangePage(index, vm.pageSize);
            }
            else if (vm.changePage && vm.changePage()) {
                vm.changePage()(index, vm.pageSize);
            }
        }
        setPage(vm.currentPage || 1);
    }
})();
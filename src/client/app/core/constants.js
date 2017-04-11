/* global toastr:false, moment:false , $:false, d3:false*/
(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('moment', moment)
    .constant('jquery', $)
    .constant('d3', d3);

})();

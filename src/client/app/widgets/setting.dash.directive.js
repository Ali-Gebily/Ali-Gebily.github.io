(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('dashSetting', dashSetting);

  dashSetting.$inject = ['jquery'];
  /* @ngInject */
  function dashSetting(jquery) {

    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {

      //click icon controll
      $(".dash-page.compair .cover-grid .list-view .cover-item-new").on("click",".cover-icon .pen",function(){
        $(".setting-dash.edit-per").removeClass("hide");
        $(".over-lay").addClass("show");
        scrollTopPage();
      });

      $(".dash-page.compair .cover-grid .list-view .cover-item-new").on("click",".cover-icon .eye",function(){
        indexCollaboratorSelect = $(this).parent().parent().parent().parent().index()+1;
        $(".setting-dash.info-per").removeClass("hide");
        $(".over-lay").addClass("show");
        scrollTopPage();
      });

      //click delete Collaborator
      var indexCollaboratorSelect = -1;
      $(".dash-page.compair .cover-grid .list-view .cover-item-new").on("click",".cover-icon .pub",function(){
        indexCollaboratorSelect = $(this).parent().parent().parent().parent().index()+1;
        $(".setting-dash.remove-popup").removeClass("hide");
        $(".over-lay").addClass("show");
        scrollTopPage();
      });

      //click remove item Collaborator
      $(".setting-dash.remove-popup .btn-bottom .cancel").click(function () {
        hiddenAllPopup();
      });

      //click remove item Collaborator
      $(".setting-dash.remove-popup .btn-bottom .save").click(function () {
        $(".dash-page.compair .cover-grid .list-view .cover-item-new > div:nth-child("+ indexCollaboratorSelect+")").remove();
        hiddenAllPopup();
      });

      $(".over-lay").click(function(){
        hiddenAllPopup();
      });

      //click button Edit Collaborator Permissions Modal
      $(".btn-bottom .cancel").click(function () {
        hiddenAllPopup();
      });

      $(".btn-bottom .save").click(function () {
        hiddenAllPopup();
      });

      //click button cancel on popup setting DashBoard
      $(".setting-dash.dashboard-page .btn-bottom .cancel").click(function(){
        $(".setting-dash.dashboard-page .country").html(oldDataCountrySetting);
        hiddenAllPopup();
      });


      //hidden All Popup
      function hiddenAllPopup(){
        $(".setting-dash").addClass("hide");
        $(".over-lay").removeClass("show");
      }

      //scroll top
      function scrollTopPage(){
        $("body,html").animate({
          scrollTop:0
        },200);
      }
    }
  }
})();

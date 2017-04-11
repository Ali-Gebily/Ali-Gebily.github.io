function searchFilterInit() {
  $(".query-page .filter .btn-hide").click(function(){
    $(".query-page .filter").removeClass("active");
  });

  $(".query-page .filter .btn-filter").click(function(){
    $(".query-page .filter").addClass("active");
  });
}

function queryListMyQueryTabClicked() {
  $(".query-page .list-style .tag a:first-child").click(function(){
    $(".query-page .list-style .tag a:first-child").addClass("active");
    $(".query-page .list-style .tag a:nth-child(2)").removeClass("active");

    $(".query-page .list-style .cover-main .content-tab-my-query").removeClass("hide");    
  });
}

function profilePageInit() {
  //click Button edit
  $(".profile .btn-edit").click(function(){
    if ($(".main-container .profile").hasClass("active")) {
      $(".main-container .profile").removeClass("active");
      $(".edit-profile-titlepage").addClass("hide");
      $(".my-profile-titlepage").removeClass("hide");
    }else{
      $(".main-container .profile").addClass("active");
      $(".edit-profile-titlepage").removeClass("hide");
      $(".my-profile-titlepage").addClass("hide");
    }
  });

  //click Save Edit
  $(".profile .btn-bottom .save").click(function(){
    makeProfilePageReadOnly();
  });

  $(".profile .btn-bottom .cancel").click(function(){
    $(".main-container .profile").removeClass("active");
    $(".main-container .profile").removeClass("active");
    $(".edit-profile-titlepage").addClass("hide");
    $(".my-profile-titlepage").removeClass("hide");
  });
}

function makeProfilePageReadOnly() {
  $(".main-container .profile").removeClass("active");
  $(".edit-profile-titlepage").addClass("hide");
  $(".my-profile-titlepage").removeClass("hide");
}

function showLoginBackDrop() {
  $("header").addClass("blur");
  $("footer").addClass("blur");
  $(".main-container").addClass("blur");
  $("body").addClass("lock-scroll");
  $("body").addClass("login-page");
  $("body,html").animate({
    scrollTop:0
  },200);
}

function removeLoginBackDrop() {
  $("header").removeClass("blur");
  $("footer").removeClass("blur");
  $(".main-container").removeClass("blur");
  $("body").removeClass("lock-scroll");
  $("body").removeClass("login-page");
}





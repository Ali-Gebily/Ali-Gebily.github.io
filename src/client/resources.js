(function() {
    var cssFiles = [
        "https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700",
        "/bower_components/font-awesome/css/font-awesome.min.css",
        "/css/lineChart.css",
        "/bower_components/bootstrap/dist/css/bootstrap.css",
        "/bower_components/ion.rangeSlider/css/ion.rangeSlider.css",
        "/bower_components/ion.rangeSlider/css/ion.rangeSlider.skinFlat.css",
        "/bower_components/gridstack/dist/gridstack.css",
        "/bower_components/jquery-nice-select/css/nice-select.css",
        "/bower_components/slick-carousel/slick/slick.css",
        "/bower_components/textAngular/dist/textAngular.css",
        "/bower_components/sumoselect/sumoselect.css",
        "/tmp/styles.css",
        "/bower_components/jquery-ui/themes/base/jquery-ui.css"
    ];

    var jsFiles = [
        "/bower_components/jquery/dist/jquery.js",
        "/bower_components/angular/angular.js",
        "/bower_components/angular-sanitize/angular-sanitize.js",
        "/bower_components/angular-animate/angular-animate.js",
        "/bower_components/angular-messages/angular-messages.js",
        "/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
        "/bower_components/angular-contentful/dist/angular-contentful.js",
        "/bower_components/angular-ui-router/release/angular-ui-router.js",
        "/bower_components/angular-confirm-modal/angular-confirm.js",
        "/bower_components/d3/d3.js", "/bower_components/d3-tip/index.js",
        "/bower_components/topojson/topojson.js",
        "/bower_components/datamaps/dist/datamaps.all.js",
        "/bower_components/bootstrap/dist/js/bootstrap.js",
        "/bower_components/extras.angular.plus/ngplus-overlay.js",
        "/bower_components/ion.rangeSlider/js/ion.rangeSlider.js",
        "/bower_components/lodash/lodash.js",
        "/bower_components/jquery-ui/jquery-ui.js",
        "/bower_components/gridstack/dist/gridstack.js",
        "/bower_components/jknob/js/jquery.knob.js",
        "/bower_components/jquery-nice-select/js/jquery.nice-select.min.js",
        "/bower_components/moment/moment.js",
        "/bower_components/rangy/rangy-core.js",
        "/bower_components/rangy/rangy-classapplier.js",
        "/bower_components/rangy/rangy-highlighter.js",
        "/bower_components/rangy/rangy-selectionsaverestore.js",
        "/bower_components/rangy/rangy-serializer.js",
        "/bower_components/rangy/rangy-textrange.js",
        "/bower_components/slick-carousel/slick/slick.js",
        "/bower_components/textAngular/dist/textAngular.js",
        "/bower_components/textAngular/dist/textAngular-sanitize.js",
        "/bower_components/textAngular/dist/textAngularSetup.js",
        "/bower_components/sumoselect/jquery.sumoselect.js",
        "/bower_components/showdown/dist/showdown.js",
        "/bower_components/ng-showdown/dist/ng-showdown.js",
        "/bower_components/jspdf/dist/jspdf.debug.js",
        "/bower_components/html2canvas/build/html2canvas.js",
        "/bower_components/marked/lib/marked.js",
        "/libs/rgbcolor.js",
        "/libs/StackBlur.js",
        "/libs/canvg.min.js",
        "/src/client/app/jquery_legacy/legacy.js",
        "/src/client/app/app.module.js",
        "/src/client/app/admin-profile/adminprofile.module.js",
        "/src/client/app/alertdetail/alertdetail.module.js",
        "/src/client/app/alertSearch/alertsearch.module.js",
        "/src/client/app/authentication/authentication.module.js",
        "/src/client/app/blocks/confirm/confirm.module.js",
        "/src/client/app/blocks/exception/exception.module.js",
        "/src/client/app/blocks/logger/logger.module.js",
        "/src/client/app/blocks/router/router.module.js",
        "/src/client/app/case-details/casedetails.module.js",
        "/src/client/app/case-studies/casestudies.module.js",
        "/src/client/app/core/core.module.js",
        "/src/client/app/dashboard/dashboard.module.js",
        "/src/client/app/data-comparison/dataComparison.module.js",
        "/src/client/app/forum-create-post/forumcreatepost.module.js",
        "/src/client/app/forum-post/forumpost.module.js",
        "/src/client/app/forum-widgets/forum-widgets.module.js",
        "/src/client/app/forum/forum.module.js",
        "/src/client/app/home/home.module.js",
        "/src/client/app/layout/layout.module.js",
        "/src/client/app/profile/profile.module.js",
        "/src/client/app/public-profile/publicprofile.module.js",
        "/src/client/app/query-list/querylist.module.js",
        "/src/client/app/register/register.module.js",
        "/src/client/app/search-data/searchdata.module.js",
        "/src/client/app/species-database/speciesdatabase.module.js",
        "/src/client/app/tips/tips.module.js",
        "/src/client/app/widgets/widgets.module.js",
        "/src/client/app/admin-profile/adminprofile.controller.js",
        "/src/client/app/admin-profile/adminprofile.route.js",
        "/src/client/app/alertdetail/alertdetail.controller.js",
        "/src/client/app/alertdetail/alertdetail.route.js",
        "/src/client/app/alertSearch/alertsearch.controller.js",
        "/src/client/app/alertSearch/alertsearch.route.js",
        "/src/client/app/alertSearch/alertService.js",
        "/src/client/app/authentication/authComplete.js",
        "/src/client/app/authentication/login.controller.js",
        "/src/client/app/authentication/modal.service.js",
        "/src/client/app/blocks/exception/exception-handler.provider.js",
        "/src/client/app/blocks/exception/exception.js",
        "/src/client/app/blocks/logger/logger.js",
        "/src/client/app/blocks/router/router-helper.provider.js",
        "/src/client/app/case-details/casedetails.controller.js",
        "/src/client/app/case-details/casedetails.route.js",
        "/src/client/app/case-studies/casestudies.controller.js",
        "/src/client/app/case-studies/casestudies.route.js",
        "/src/client/app/contentful/contentful.service.js",
        "/src/client/app/core/config.js",
        "/src/client/app/core/constants.js",
        "/src/client/app/core/core.route.js",
        "/src/client/app/core/currentUser.js",
        "/src/client/app/core/dataservice.js",
        "/src/client/app/core/directives/confirmPasswordValidation.js",
        "/src/client/app/core/directives/enterKey.js",
        "/src/client/app/core/directives/imageSelect.js",
        "/src/client/app/core/directives/onlyDigits.js",
        "/src/client/app/core/errors/errors.controller.js",
        "/src/client/app/core/http.Interceptor.js",
        "/src/client/app/core/httpHelper.js",
        "/src/client/app/core/imageUpload.js",
        "/src/client/app/core/lookupService.js",
        "/src/client/app/core/serverProxy.js",
        "/src/client/app/core/spinner.service.js",
        "/src/client/app/core/storage.js",
        "/src/client/app/core/userService.js",
        "/src/client/app/core/util.js",
        "/src/client/app/dashboard/dashboard.controller.js",
        "/src/client/app/dashboard/dashboard.route.js",
        "/src/client/app/dashboard/dashboard.service.js",
        "/src/client/app/dashboard/dashboardService.js",
        "/src/client/app/data-comparison/dataComparison.controller.js",
        "/src/client/app/data-comparison/dataComparison.route.js",
        "/src/client/app/forum-create-post/forumcreatepost.controller.js",
        "/src/client/app/forum-create-post/forumcreatepost.route.js",
        "/src/client/app/forum-post/forumpost.controller.js",
        "/src/client/app/forum-post/forumpost.route.js",
        "/src/client/app/forum-post/forumpost.service.js",
        "/src/client/app/forum-widgets/hot-topics.directive.js",
        "/src/client/app/forum-widgets/latest-posts.directive.js",
        "/src/client/app/forum/forum.controller.js",
        "/src/client/app/forum/forum.route.js",
        "/src/client/app/forum/forum.service.js",
        "/src/client/app/home/home.controller.js",
        "/src/client/app/home/home.route.js",
        "/src/client/app/jquery_legacy/legacy.js",
        "/src/client/app/layout/app-footer.directive.js",
        "/src/client/app/layout/app-nav.directive.js",
        "/src/client/app/layout/ht-sidebar.directive.js",
        "/src/client/app/profile/profile.controller.js",
        "/src/client/app/profile/profile.route.js",
        "/src/client/app/public-profile/publicprofile.controller.js",
        "/src/client/app/public-profile/publicprofile.route.js",
        "/src/client/app/query-list/querylist.controller.js",
        "/src/client/app/query-list/querylist.route.js",
        "/src/client/app/register/PasswordResetController.js",
        "/src/client/app/register/register.controller.js",
        "/src/client/app/register/register.route.js",
        "/src/client/app/search-data/searchdata.controller.js",
        "/src/client/app/search-data/searchdata.route.js",
        "/src/client/app/search-data/tradeDataService.js",
        "/src/client/app/species-database/speciesdatabase.controller.js",
        "/src/client/app/species-database/speciesdatabase.route.js",
        "/src/client/app/tips/tips.controller.js",
        "/src/client/app/tips/tips.route.js",
        "/src/client/app/widgets/confirm.directive.js",
        "/src/client/app/widgets/custom-pagination.directive.js",
        "/src/client/app/widgets/jquery.augmentation.directive.js",
        "/src/client/app/widgets/message.directive.js",
        "/src/client/app/widgets/niceselect.directive.js",
        "/src/client/app/widgets/onFileChange.directive.js",
        "/src/client/app/widgets/setting.dash.directive.js",
        "/src/client/app/widgets/temporalView.directive.js",
        "/src/client/app/widgets/user-panel.js"
    ];

    var img = document.createElement('img');

    function loadNextStyle(index) {
        if (index < cssFiles.length) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute('type', 'text/css');
            link.href = cssFiles[index];
            document.head.appendChild(link);
            img.onerror = function() {
                // console.log(link.href + " is loaded")
                loadNextStyle(index + 1);
            }
            img.src = link.href;
        } else {
            loadNextScript(0);
        }
    };

    function loadNextScript(index) {
        if (index < jsFiles.length) {
            var script = document.createElement("script");
            script.src = jsFiles[index];
            script.onload = function() {
                // console.log(script.src + " is loaded")
                loadNextScript(index + 1);
            }
            document.head.appendChild(script);
        } else {
            angular.bootstrap(angular.element("html")[0], ['app']);
            console.log('Execution time: ' + ((new Date().getTime()) - start));
        }
    };
    var start = new Date().getTime();
    loadNextStyle(0);


}());
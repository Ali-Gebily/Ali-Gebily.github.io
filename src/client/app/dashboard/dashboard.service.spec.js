/* jshint -W117, -W030 */
/* jshint multistr:true */

describe('DashboardServiceAPI', function () {

  beforeEach(module('app.dashboard'));

  var dashboardServiceApi, $httpBackend;
  beforeEach(inject(function (_DashboardService_, _$httpBackend_) {
    dashboardServiceApi = _DashboardService_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get notifications', function () {

    $httpBackend.expect('GET', '/api/notifications?query=%7B%7D').respond(200, [{}]);
    var promise = dashboardServiceApi.notifications({});
    expect($httpBackend.flush).not.Throw();
    promise.then(function (data) {
      expect(data.length).toEqual(1);
    });
  });

  it('should get new case studies', function () {

    $httpBackend.expect('GET', '/api/newcasestudies?query=%7B%7D').respond(200, [{}, {},{}]);
    var promise = dashboardServiceApi.newCaseStudies({});
    expect($httpBackend.flush).not.Throw();
    promise.then(function (data) {
      expect(data.length).toEqual(3);
    });
  });

  it('should get notifications by class', function () {

    $httpBackend.expect('GET', '/api/notificationsclass?notifClass=General').
    respond(200, [{}, {},{},{}]);
    var promise = dashboardServiceApi.notificationsByClass('General');
    expect($httpBackend.flush).not.Throw();
    promise.then(function (data) {
      expect(data.length).toEqual(4);
    });
  });
});

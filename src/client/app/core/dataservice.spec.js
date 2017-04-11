/* jshint -W117, -W030 */
/* jshint multistr:true */

describe('DataServiceAPI', function() {

  beforeEach(module('app.core'));

  var dataApi, $httpBackend;
  beforeEach(inject(function(_dataservice_, _$httpBackend_) {
    dataApi = _dataservice_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get line data', function() {

    $httpBackend.expect('GET', '/api/linedata').respond(200, [{},{}]);
    var result = dataApi.lineData();
    expect($httpBackend.flush).not.Throw();

    result.then(function (data) {
      expect(data.length).toEqual(2);
    });
  });

  it('should get alert comments', function() {

    $httpBackend.expect('GET', '/api/alertcomments/1').respond(200, [{},{}, {}]);
    var result = dataApi.alertComments(1);
    expect($httpBackend.flush).not.Throw();

    result.then(function (data) {
      expect(data.length).toEqual(3);
    });
  });

  it('should get data comparison', function() {

    $httpBackend.expect('GET', '/api/datacomparison?query=%7B%7D').
    respond(200, [{},{}, {}, {}, {}]);
    var result = dataApi.dataComparison({});
    expect($httpBackend.flush).not.Throw();

    result.then(function (data) {
      expect(data.length).toEqual(5);
    });
  });

  it('should get query list results', function() {

    $httpBackend.expect('GET', '/api/myquerylist?query=%7B%7D').
    respond(200, [{},{}, {}, {}, {},{}]);
    var result = dataApi.myQueryList({});
    expect($httpBackend.flush).not.Throw();

    result.then(function (data) {
      expect(data.length).toEqual(6);
    });
  });  

  it('should get monthly line data results', function() {

    $httpBackend.expect('GET', '/api/monthlylinedata').
    respond(200, [{},{}, {}, {}, {},{},{},{}]);
    var result = dataApi.monthlyLineData({});
    expect($httpBackend.flush).not.Throw();

    result.then(function (data) {
      expect(data.length).toEqual(8);
    });
  });

  it('should get yearly line data results', function() {

    $httpBackend.expect('GET', '/api/yearlineData').
    respond(200, [{},{}, {}, {}, {},{},{},{},{}]);
    var result = dataApi.yearlyLineData({});
    expect($httpBackend.flush).not.Throw();

    result.then(function (data) {
      expect(data.length).toEqual(9);
    });
  });
});

/* jshint -W117, -W030 */
/* jshint multistr:true */

describe('ForumServiceAPI', function() {

  beforeEach(module('app.forum'));

  var forumApi, $httpBackend;
  beforeEach(inject(function(_ForumService_, _$httpBackend_) {
    forumApi = _ForumService_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get forum threads', function() {

    $httpBackend.expect('GET', '/api/forumthreads?searchquery=%7B%7D').respond(200);
    forumApi.forumThreads({});
    expect($httpBackend.flush).not.Throw();
  });

  it('should get hot topics', function() {

    $httpBackend.expect('GET', '/api/hottopics?searchquery=%7B%7D').respond(200);
    forumApi.hotTopics({});
    expect($httpBackend.flush).not.Throw();
  });

  it('should get latest posts', function() {

    $httpBackend.expect('GET', '/api/latestposts?searchquery=%7B%7D').respond(200);
    forumApi.latestPosts({});
    expect($httpBackend.flush).not.Throw();
  });
});

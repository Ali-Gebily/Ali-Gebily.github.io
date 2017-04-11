/* jshint -W117, -W030 */
/* jshint multistr:true */

describe('ForumPostServiceAPI', function() {

  beforeEach(module('app.forumpost'));

  var forumPostApi, $httpBackend;
  beforeEach(inject(function(_ForumPostService_, _$httpBackend_) {
    forumPostApi = _ForumPostService_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get forum post comments', function() {

    $httpBackend.expect('GET', '/api/postcomments?searchquery=%7B%7D').respond(200);
    forumPostApi.postComments({});
    expect($httpBackend.flush).not.Throw();
  });

  it('should get hot topics', function() {

    $httpBackend.expect('GET', '/api/hottopics?searchquery=%7B%7D').respond(200);
    forumPostApi.hotTopics({});
    expect($httpBackend.flush).not.Throw();
  });

  it('should get latest posts', function() {

    $httpBackend.expect('GET', '/api/latestposts?searchquery=%7B%7D').respond(200);
    forumPostApi.latestPosts({});
    expect($httpBackend.flush).not.Throw();
  });
});

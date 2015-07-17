var cases = require('../test/url-test-cases');
var url = require('url');

var buildUrl = require('./build-url');
var parseQueryString = require('./parse-query-string');

describe('build-url', function () {

  it('should be defined', function () {
    expect(buildUrl).not.to.be.undefined;
  });

  it('should be function', function () {
    expect(buildUrl).to.be.a('function');
  });

  it('should return undefined on non moysklad url', function () {
    //TODO
  });

  it('should build moysklad urls', function () {
    var that = this;
    cases.forEach(function (caseItem) {
      var expectedUrl = url.parse(caseItem.urls ? caseItem.urls[0] : caseItem.url, true);
      var state = caseItem.result;

      window.location.protocol = expectedUrl.protocol;
      window.location.hostname = expectedUrl.hostname;
      window.location.pathname = expectedUrl.pathname;

      var buildedUrl = buildUrl(state);
      var actualUrl = url.parse(buildedUrl, true);

      expect(actualUrl.host).to.be.equal(expectedUrl.host);
      expect(actualUrl.pathname).to.be.equal(expectedUrl.pathname);
      expect(actualUrl.query || {}).to.be.eql(expectedUrl.query || {});

      var expectedHash = (expectedUrl.hash || '').substring(1);
      expectedHash = parseQueryString(expectedHash.substring(expectedHash.indexOf('?') + 1));

      var actualHash = (actualUrl.hash || '').substring(1);
      actualHash = parseQueryString(actualHash.substring(actualHash.indexOf('?') + 1));

      expect(actualHash).to.be.eql(expectedHash);
    });
  })

});
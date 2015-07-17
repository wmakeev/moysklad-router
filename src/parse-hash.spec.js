var cases = require('../test/url-test-cases');

describe('parse-hash', function () {

  beforeEach(function () {
    this.parseHash = require('./parse-hash');
  });

  it('should be defined', function () {
    expect(this.parseHash).not.to.be.undefined;
  });

  it('should be function', function () {
    expect(this.parseHash).to.be.a('function');
  });

  it('should return undefined on non moysklad url', function () {
    expect(this.parseHash('some/foo')).to.be.undefined;
  });

  it('should parse moysklad urls', function () {
    var that = this;

    cases.forEach(function (caseItem) {
      var urls = caseItem.urls || [caseItem.url];
      urls.forEach(function (url) {
        expect(that.parseHash(url)).to.be.eql(caseItem.result)
      })
    })
  });

});


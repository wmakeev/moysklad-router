/**
 * build-url
 * Date: 02.05.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var cases = require('./url-test-cases');
var url = require('url');

var buildUrl = require('../src/build-url');
var parseQueryString = require('../src/parse-query-string');

module.exports = function () {

    //beforeEach(function () {
    //});

    it('should be defined', function () {
        expect(buildUrl).not.to.be.undefined;
    });

    it('should be function', function () {
        expect(buildUrl).to.be.a('function');
    });

    it('should return undefined on non moysklad url', function () {

    });

    it('should build moysklad urls', function () {
        var that = this;
        var tmp;
        cases.forEach(function (caseItem) {
            var expectedUrl = url.parse(caseItem.urls ? caseItem.urls[0] : caseItem.url, true);
            var state = caseItem.result;

            var actualUrl = url.parse((tmp = buildUrl(state)), true);

            expect(actualUrl.host)       .to.be.equal(expectedUrl.host);
            expect(actualUrl.pathname)   .to.be.equal(expectedUrl.pathname);
            expect(actualUrl.query || {}).to.be.eql(expectedUrl.query || {});

            var expectedHash = (expectedUrl.hash || '').substring(1);
            expectedHash = parseQueryString(expectedHash.substring(expectedHash.indexOf('?') + 1));

            var actualHash = (actualUrl.hash || '').substring(1);
            actualHash = parseQueryString(actualHash.substring(actualHash.indexOf('?') + 1));

            expect(actualHash).to.be.eql(expectedHash);
        })
        console.log(tmp);
    })

};
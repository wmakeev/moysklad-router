/**
 * parse-url.spec.js
 * Date: 18.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var cases = require('./parse-url-cases');

module.exports = function () {

    beforeEach(function () {
        this.parseUrl = require('../src/parse-url');
    });

    it('should be defined', function () {
        expect(this.parseUrl).not.to.be.undefined;
    });

    it('should be function', function () {
        expect(this.parseUrl).to.be.a('function');
    });

    it('should return undefined on non moysklad url', function () {
        expect(this.parseUrl('some/foo')).to.be.undefined;
    });

    it('should parse moysklad urls', function () {
        var that = this;

        cases.forEach(function (caseItem) {
            var urls = caseItem.urls || [caseItem.url];
            urls.forEach(function (url) {
                expect(that.parseUrl(url)).to.be.eql(caseItem.result)
            })
        })
    })

};


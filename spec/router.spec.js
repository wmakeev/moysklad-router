/**
 * router.spec
 * Date: 12.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

global.sinon  = require("sinon");
global.chai   = require("chai");

expect = chai.expect;
chai.use(require("sinon-chai"));

describe('moysklad-router', function () {

    beforeEach(function () {
        this.Router   = require('../src');
        global.window = {
            location: {
                href: "https://online.moysklad.ru/app/#warehouse/edit?id=eed5fae7-c949-4258-8e27-69f306d7166c"
            },
            onhashchange: {},
            addEventListener: sinon.spy(),
            removeEventListener: sinon.spy()
        };
    });

    it('should be defined', function () {
        expect(this.Router).to.be.ok;
    });

    it('should be function', function () {
        expect(this.Router).to.be.a('function');
    });

    describe('instance', function () {
        
        beforeEach(function () {
            this.router = this.Router();
        });

        it('should have methods', function () {
            expect(this.router.start)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.stop)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.checkUrl)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.navigate)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.replaceState)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.refresh)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.getState)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.state)
                .to.be.eql(null);

            expect(this.router.on)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.off)
                .to.be.ok.and
                .to.be.a('function');
        });

        it('should throw error if no window.hashchange', function () {
            delete global.window.onhashchange;
            expect(this.router.start)
                .to.throw('The browser not supports the hashchange event!');
        });

        it('should not throw if window.hashchange exist', function () {
            expect(this.router.start)
                .to.not.throw('The browser not supports the hashchange event!');
        });

        it('should add and remove checkUrl event listener to hashchange event', function () {

            var router = this.router.start();
            expect(global.window.addEventListener).to.be
                .calledOnce.and
                .calledWith("hashchange", this.router.checkUrl, false);

            expect(router.state).to.be.ok;
            expect(router.state.section).to.be.equal('warehouse');

            this.router.stop();
            expect(global.window.removeEventListener)
                .to.be.calledOnce.and
                .calledWith("hashchange", this.router.checkUrl);
        });

        it('should call all route handlers on checkUrl', function () {
            var spy1 = sinon.spy();
            this.router.on('route', spy1);

            var spy2 = sinon.spy();
            this.router.on('route', spy2);

            // checkUrl should be binded to this router
            this.router.checkUrl({
                newURL: 'https://online.moysklad.ru/app/#demand',
                oldURL: 'https://online.moysklad.ru/app/#customerorder'
            });

            var arg1 = {
                "newURL": {
                    "app": "app",
                    "queryString": {},
                    "query": {},
                    "section": "demand",
                    "host": "online.moysklad.ru"
                },
                "oldURL": {
                    "app": "app",
                    "queryString": {},
                    "query": {},
                    "section": "customerorder",
                    "host": "online.moysklad.ru"
                }
            };

            expect(spy1).to.be.calledOnce.and.calledWith(arg1.newURL, this.router);
            expect(spy2).to.be.calledOnce.and.calledWith(arg1.newURL, this.router);

            expect(this.router.state).to.be.eql(arg1.newURL);
        });

        it('should emit "start" event on router.start()', function () {
            //TODO
        });

        it('should emit "stop" event on router.stop()', function () {
            //TODO
        });

        //TODO navigate

        //TODO getState

        //TODO replaceState

        //TODO refresh

    });

    describe('parse-url', require('./parse-url'));

    describe('build-url', require('./build-url'));

});
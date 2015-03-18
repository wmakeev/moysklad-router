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
        var Router      = this.Router   = require('../src');
        global.window = {
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

    it('should be constructor', function() {
        var router = new this.Router();
        expect(router).to.be.instanceof(this.Router);
    });

    it('should be called without "new"', function() {
        var router = this.Router();
        expect(router).to.be.instanceof(this.Router);
    });
    
    describe('instance', function () {
        
        beforeEach(function () {
            this.router = new this.Router;
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

            expect(this.router.addRouteHandler)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.removeRouteHandler)
                .to.be.ok.and
                .to.be.a('function');

            expect(this.router.removeAllRouteHandlers)
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
            this.router.start();
            expect(global.window.addEventListener)
                .to.be.calledOnce.and
                .calledWith("hashchange", this.router.checkUrl, false);

            this.router.stop();
            expect(global.window.removeEventListener)
                .to.be.calledOnce.and
                .calledWith("hashchange", this.router.checkUrl);
        });

        it('addRouteHandler should throw if route handler is not function', function () {
            var that = this;
            expect(function () {
                that.router.addRouteHandler({});
            }).to.throw('Handler must be a function');
        });

        it('removeRouteHandler should throw if route handler is not function', function () {
            var that = this;
            expect(function () {
                that.router.removeRouteHandler({});
            }).to.throw('Handler must be a function');
        });

        it('should set route handler', function () {
            var handler = function () {};
            this.router.addRouteHandler(handler);
            expect(this.router._handlers[0]).to.equal(handler);
        });

        it('should set same route handler only once', function () {
            var handler = function () {};
            this.router.addRouteHandler(handler);
            this.router.addRouteHandler(handler);
            expect(this.router._handlers.length).to.equal(1);
            expect(this.router._handlers[0]).to.equal(handler);
        });

        it('should remove specific route handler', function () {
            var handler1 = function () {};
            this.router.addRouteHandler(handler1);

            var handler2 = function () {};
            this.router.addRouteHandler(handler2);

            this.router.removeRouteHandler(handler1);

            expect(this.router._handlers.length).to.equal(1);
            expect(this.router._handlers[0]).to.equal(handler2);
        });

        it('should remove all route handlers', function () {
            this.router.addRouteHandler(function () {});
            this.router.addRouteHandler(function () {});

            this.router.removeAllRouteHandlers();

            expect(this.router._handlers.length).to.equal(0);
        });

        it('should call all route handlers on checkUrl', function () {
            var spy1 = sinon.spy();
            this.router.addRouteHandler(spy1);

            var spy2 = sinon.spy();
            this.router.addRouteHandler(spy2);

            // checkUrl should be binded to this router
            var checkUrl = this.router.checkUrl;

            checkUrl({
                newURL: 'https://online.moysklad.ru/app/#demand',
                oldURL: 'https://online.moysklad.ru/app/#customerorder'
            });

            var arg1 = {
                "newURL": {
                    "app": "app",
                    "hash": {
                        "action": null,
                        "query": {},
                        "section": "demand"
                    },
                    "host": "online.moysklad.ru",
                    "query": null
                },
                "oldURL": {
                    "app": "app",
                    "hash": {
                        "action": null,
                        "query": {},
                        "section": "customerorder"
                    },
                    "host": "online.moysklad.ru",
                    "query": null
                }
            };

            expect(spy1).to.be.calledOnce.and.calledWith(arg1);
            expect(spy2).to.be.calledOnce.and.calledWith(arg1);
        });
    });

    describe('parse-url', require('./parse-url'));

});
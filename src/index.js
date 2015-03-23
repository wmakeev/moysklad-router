/**
 * index.js
 * Date: 12.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var parseUrl = require('./parse-url');

/**
 * Creates new route
 * @constructor
 * @param {Object} options
 */
var Router = function (options) {
    if ( ! (this instanceof Router)) {
        return new Router(options);
    }
    this.checkUrl = this.checkUrl.bind(this);
    this.state = null;
};

Router.prototype.start = function () {
    if (window && "onhashchange" in window) {
        window.addEventListener("hashchange", this.checkUrl, false);
        this.checkUrl({
            newURL: window.location.href,
            oldURL: undefined
        });
    } else throw new Error('The browser not supports the hashchange event!');
    return this;
};

Router.prototype.stop = function () {
    window.removeEventListener("hashchange", this.checkUrl);
};

Router.prototype.checkUrl = function (e) {
    var that = this;
    if (that._handlers && that._handlers.length) {
        that.state = {
            newURL: parseUrl(e.newURL),
            oldURL: parseUrl(e.oldURL)
        };
        that._handlers.forEach(function (handler) {
            handler(that.state);
        });
    }
};

Router.prototype.addRouteHandler = function (handler) {
    if (typeof handler !== 'function') throw new TypeError('Handler must be a function');
    this._handlers = this._handlers || [];
    if (this._handlers.indexOf(handler) == -1) this._handlers.push(handler);
};

Router.prototype.removeRouteHandler = function (handler) {
    if (typeof handler !== 'function') throw new TypeError('Handler must be a function');
    this._handlers = this._handlers.reduce(function (res, registeredHandler) {
        if (handler !== registeredHandler) res.push(registeredHandler);
        return res;
    }, []);
};

Router.prototype.removeAllRouteHandlers = function () {
    this._handlers = [];
};

module.exports = Router;
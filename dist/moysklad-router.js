!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.moyskladRouter=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * index.js
 * Date: 18.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

module.exports = require('./src');
},{"./src":2}],2:[function(require,module,exports){
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
    that.state = {
        newURL: parseUrl(e.newURL),
        oldURL: parseUrl(e.oldURL)
    };
    if (that._handlers && that._handlers.length) {
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
},{"./parse-url":3}],3:[function(require,module,exports){
/**
 * parse
 * Date: 13.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

// https://regex101.com/r/yS0bG7/7
var routeRegex = /https:\/\/([\w.]+)\/?(?:([\w]+\/?[\w]+))?(?:\?(.+))?(?:\/#)?(?:([\w-]+)(?:\/(\w+))?(?:\?(.+))?)?/;

function extractQueryValue (str) {
    return str.indexOf(',') !== -1
        ? str.split(',').map(decodeURIComponent)
        : decodeURIComponent(str);
}

function parseQueryString(queryString) {
    var queryParams = {};
    if (queryString) {
        queryString.split('&').forEach(function (queryPart) {
            var kv = queryPart.split('=');
            queryParams[kv[0]] = kv[1]
                ? extractQueryValue(kv[1])
                : null;
        });
    }
    return queryParams;
}

var parseUrl = function (url) {
    var match = routeRegex.exec(url);

    if (match && match.length) {
        var result = {
            host: match[1],
            queryString: parseQueryString(match[3]),
            query: parseQueryString(match[6])
        };

        if (match[2]) result.app = match[2];
        if (match[4]) {
            result.section = match[4];
            if (match[5]) result.action = match[5];
        }

        return result;
    }
};

module.exports = parseUrl;
},{}]},{},[1])(1)
});
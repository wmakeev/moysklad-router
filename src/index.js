/**
 * index.js
 * Date: 12.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var parseUrl = require('./parse-url'),
    buildUrl = require('./build-url'),
    EventEmitter = require('event-emitter'),
    cloneDeep = require('lodash.clonedeep'),
    defaults = require('lodash.defaults'),
    assign = require('lodash.assign');

var _customizer = function (objectValue, sourceValue) {
    if (sourceValue === void 0) return objectValue;

    else if (
        (typeof objectValue === 'object' && !(objectValue instanceof Array)) &&
        (typeof sourceValue === 'object' && !(sourceValue instanceof Array))
    ) return assign(objectValue, sourceValue, _customizer);

    else return sourceValue;
};

var _updateState = function (newState, oldState, isMod) {
    if (isMod)
        return assign(oldState, newState, _customizer);
    else
        return defaults(newState, {
            host: oldState.host,
            app: oldState.app,
            queryString: oldState.queryString
        });
};

/**
 * Creates new router
 * @constructor
 * @param {Object} options
 */
var Router = function (options) {
    var router = function (route, isMod) {
        router.navigate(route, isMod);
    };

    EventEmitter(router);

    router.checkUrl = checkUrl.bind(router);
    router.start = start;
    router.stop = stop;
    router.navigate = navigate;
    router.replaceState = replaceState;
    router.refresh = refresh;
    router.getState = getState;
    router.getHashPath = getHashPath;
    router.state = null;

    return router;
};

var start = function () {
    if (window && "onhashchange" in window) {
        window.addEventListener("hashchange", this.checkUrl, false);
        this.started = true;
        this.emit('start', this);
        this.checkUrl({
            newURL: window.location.href,
            oldURL: undefined
        });
    } else throw new Error('The browser not supports the hashchange event!');
    return this;
};

var stop = function () {
    window.removeEventListener("hashchange", this.checkUrl);
    this.started = false;
    this.state = null;
    this.emit('stop', this);
};

var checkUrl = function (e) {
    this.state = parseUrl(e.newURL);
    this.emit('route', cloneDeep(this.state), this);
};

var navigate = function (state, isMod) {
    if (!this.started) throw new Error('Роутер не запущен. Используйте router.start()');
    var _state = _updateState(cloneDeep(state), this.getState(), isMod);
    window.location = buildUrl(_state);
    return this;
};

var replaceState = function (state, isMod) {
    if (!this.started) throw new Error('Роутер не запущен. Используйте router.start()');
    var _state = _updateState(cloneDeep(state), this.getState(), isMod);
    history.replaceState(null, null, buildUrl(_state));
    return this;
};

var refresh = function () {
    this.replaceState({
        query: {
            refresh: +(new Date)
        }
    }, true)
};

var getHashPath = function () {
    var _state = this.getState();
    return _state.section + (_state.action ? '/' + _state.action : '');
};

var getState = function () {
    if (!this.started) throw new Error('Роутер не запущен. Используйте router.start()');
    return cloneDeep(this.state);
};

module.exports = Router;
var parseHash    = require('./parse-hash'),
    buildUrl     = require('./build-url'),
    EventEmitter = require('event-emitter'),
    cloneDeep    = require('lodash').cloneDeep,
    defaults     = require('lodash').defaults,
    assign       = require('lodash').assign;

//var pkg = require('../package');

function deepAssignCustomizer(objectValue, sourceValue) {
  if (sourceValue === void 0) return objectValue;

  else if (
    (typeof objectValue === 'object' && !(objectValue instanceof Array)) &&
    (typeof sourceValue === 'object' && !(sourceValue instanceof Array))
  ) return assign(objectValue, sourceValue, deepAssignCustomizer);

  else return sourceValue;
}

function updateState(newState, oldState, isMod) {
  if (isMod)
    return assign(oldState, newState, deepAssignCustomizer);
  else
    return defaults(newState, {
      host: oldState.host,
      app: oldState.app,
      queryString: oldState.queryString
    });
}

function parseNavigateArgs(arguments) {
  var args = Array.prototype.slice.call(arguments, 0);
  var state = {};
  if (typeof args[0] === 'string') {
    state.path = args.shift();
    if (typeof args[0] === 'string') {
      state.query = { id: args.shift() }
    }
    else if (typeof args[0] === 'object') {
      state.query = args.shift()
    }
  }
  else if (typeof args[0] === 'object') {
    state = args.shift();
  }
  else {
    throw new Error('Incorrect navigate arguments')
  }
  return {
    state: state,
    isPatch: args.shift()
  }
}

/**
 * Creates new router
 * @constructor
 * @param {Object} options
 */
function Router(options) {
  var router = function (route, isMod) {
    router.navigate(route, isMod);
  };

  //router.VERSION = pkg.version;

  EventEmitter(router);

  router.checkUrl = checkUrl.bind(router);
  router.start = start;
  router.stop = stop;
  router.navigate = navigate;
  router.replaceState = replaceState;
  router.refresh = refresh;
  router.getState = getState;
  router.getSection = getSection;
  router.getAction = getAction;
  router.state = null;

  return router;
}

function start() {
  if (window && "onhashchange" in window) {
    window.addEventListener("hashchange", this.checkUrl, false);
    this.started = true;
    this.checkUrl();
    this.emit('start', this);
  } else throw new Error('The browser not supports the hashchange event!');
  return this;
}

function stop() {
  window.removeEventListener("hashchange", this.checkUrl);
  this.started = false;
  this.state = null;
  this.emit('stop', this);
  return this;
}

function checkUrl() {
  this.state = parseHash(window.location.hash);
  this.emit('route', cloneDeep(this.state), this);
}

function navigate() {
  if (!this.started) {
    throw new Error('Роутер не запущен. Используйте router.start()');
  }
  var args = parseNavigateArgs(arguments);
  var newState = updateState(cloneDeep(args.state), this.getState(), args.isPatch);
  window.location = buildUrl(newState);
  return this;
}

function replaceState(state, isPatch) {
  if (!this.started) {
    throw new Error('Роутер не запущен. Используйте router.start()');
  }
  var args = parseNavigateArgs(arguments);
  var newState = updateState(cloneDeep(args.state), this.getState(), args.isPatch);
  history.replaceState(null, null, buildUrl(newState));
  return this;
}

function refresh() {
  //TODO Restore window.scroll after refresh
  this.replaceState({
    query: {
      refresh: +(new Date)
    }
  }, true);
  return this;
}

function getState() {
  if (!this.started) throw new Error('Роутер не запущен. Используйте router.start()');
  return cloneDeep(this.state);
}

function getSection() {
  return this.state.path.split('/')[0]
}

function getAction() {
  return this.state.path.split('/')[1]
}

module.exports = Router;
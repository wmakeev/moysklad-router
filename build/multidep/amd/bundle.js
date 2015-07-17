define(["multiver!lodash@^3.0.0","multiver!event-emitter@^0.3.3"], function() {
  var global = window;
  var __global_require__ = require;
  var __args__ = arguments;
  var require = (function() {
    var deps = ["lodash@^3.0.0","event-emitter@^0.3.3"].reduce(function(res, dep, index) {
      res[dep] = index;
      return res;
    }, {});
    return function(name) {
      if (name in deps) {
        return __args__[deps[name]];
      } else if (__global_require__) {
        return __global_require__(name);
      } else {
        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
    }
  })();

  return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var parseHash    = __webpack_require__(2),
	    buildUrl     = __webpack_require__(4),
	    EventEmitter = __webpack_require__(6),
	    cloneDeep    = __webpack_require__(1).cloneDeep,
	    defaults     = __webpack_require__(1).defaults,
	    assign       = __webpack_require__(1).assign;

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("lodash@^3.0.0");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// https://regex101.com/r/uV6yS6/2
	var routeRegex = /#(?:([\w-]+)(?:\/(\w+))?(?:\?(.+))?)?/;

	var parseQueryString = __webpack_require__(3);

	module.exports = function parseHash(hash) {
	  var match = routeRegex.exec(hash);
	  if (match && match.length) {
	    return {
	      path: match[1] + (match[2] ? '/' + match[2] : ''),
	      query: parseQueryString(match[3])
	    };
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	function extractQueryValue(str) {
	  return str.indexOf(',') !== -1
	    ? str.split(',').map(decodeURIComponent)
	    : decodeURIComponent(str);
	}

	module.exports = function parseQueryString(queryString) {
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
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var buildQueryString = __webpack_require__(5);

	var location = window.location;

	module.exports = function buildUrl(state) {
	  var url = [
	    location.protocol,
	    '//',
	    location.hostname,
	    location.pathname
	    // TODO Query string
	  ].join('');

	  if (state.path) {
	    url += (url.slice(-1) === '/' ? '' : '/') + '#' + state.path;
	    var query = buildQueryString(state.query, true);
	    if (query) url += '?' + query;
	  }

	  return url;
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function buildQueryString(data, isQuery) {
	  var queryString = [];
	  for (var p in data) {
	    if (data.hasOwnProperty(p)) {
	      var value = data[p];
	      if (value != null) {
	        value = value instanceof Array
	          ? value.map(isQuery ? decodeURI : decodeURIComponent).join(',')
	          : encodeURI(value);

	        queryString.push(p + '=' + value);

	      } else queryString.push(p);
	    }
	  }
	  return queryString.join('&');
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("event-emitter@^0.3.3");

/***/ }
/******/ ]);
});

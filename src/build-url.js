var buildQueryString = require('./build-query-string');

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

var buildQueryString = require('./build-query-string');

module.exports = function buildUrl(state) {
  var url = [
    window.location.protocol,
    '//',
    window.location.hostname,
    window.location.pathname
    // TODO Query string
  ].join('');

  if (state.path) {
    url += (url.slice(-1) === '/' ? '' : '/') + '#' + state.path;
    var query = buildQueryString(state.query, true);
    if (query) url += '?' + query;
  }

  return url;
};

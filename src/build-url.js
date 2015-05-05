/**
 * build-url
 * Date: 02.05.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var buildQueryString = require('./build-query-string');

var buildUrl = function (state) {
    var url = 'https://' + state.host;

    if (state.app) url += '/' + state.app;

    var queryString = buildQueryString(state.queryString);
    if (queryString) url += '/?' + queryString;

    var hash = '';
    if (state.section) hash += state.section;
    if (state.action) hash += '/' + state.action;
    if (hash) {
        url += (queryString ? '' : '/') + '#' + hash;
        var query = buildQueryString(state.query, true);
        if (query) url += '?' + query;
    }



    return url;
};

module.exports = buildUrl;
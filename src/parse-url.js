/**
 * parse
 * Date: 13.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

// https://regex101.com/r/yS0bG7/7
var routeRegex = /https:\/\/([\w.]+)\/?(?:([\w]+\/?[\w]+))?(?:\?(.+))?(?:\/#)?(?:([\w-]+)(?:\/(\w+))?(?:\?(.+))?)?/;

function parseQueryString(queryString) {
    var queryParams = null;
    if (queryString) {
        queryParams = {};
        queryString.split('&').forEach(function (queryPart) {
            var kv = queryPart.split('=');
            queryParams[kv[0]] = kv[1] ? decodeURIComponent(kv[1]) : null;
        });
    }
    return queryParams;
}

var parseUrl = function (url) {
    var match = routeRegex.exec(url);

    if (match && match.length) {
        var result = {
            host        : match[1],
            app         : match[2] || null,
            query       : parseQueryString(match[3])
        };

        result.hash = match[4] ?
        {
            section: match[4],
            action: match[5] || null,
            query: parseQueryString(match[6]) || {}
        } : {};

        return result;
    }
};

module.exports = parseUrl;
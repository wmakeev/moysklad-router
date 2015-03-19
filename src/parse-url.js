/**
 * parse
 * Date: 13.03.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

// https://regex101.com/r/yS0bG7/7
var routeRegex = /https:\/\/([\w.]+)\/?(?:([\w]+\/?[\w]+))?(?:\?(.+))?(?:\/#)?(?:([\w-]+)(?:\/(\w+))?(?:\?(.+))?)?/;

function parseQueryString(queryString) {
    var queryParams = {};
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
            host: match[1]
        };

        if (match[2]) result.app    = match[2];
        result.query = parseQueryString(match[3]);

        var hash = result.hash = {
            query: parseQueryString(match[6])
        };

        if (match[4]) {
            hash.section = match[4];
            if (match[5]) hash.action = match[5];
        }

        return result;
    }
};

module.exports = parseUrl;
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
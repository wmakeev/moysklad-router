/**
 * parse-query-string
 * Date: 02.05.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

function extractQueryValue (str) {
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
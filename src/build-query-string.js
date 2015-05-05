/**
 * build-query-string
 * Date: 02.05.15
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

module.exports = function buildQueryString (data, isQuery) {
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
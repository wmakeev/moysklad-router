'use strict'

module.exports = function buildQueryString (data, isQuery) {
  var queryString = []
  for (let p in data) {
    if (data.hasOwnProperty(p)) {
      let value = data[p]
      if (value != null) {
        value = value instanceof Array
          ? value.map(isQuery ? decodeURI : decodeURIComponent).join(',')
          : encodeURI(value)

        queryString.push(p + '=' + value)
      } else queryString.push(p)
    }
  }
  return queryString.join('&')
}

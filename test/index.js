'use strict'

try {
  require('dotenv').config()
} catch (e) {}

let walk = require('walkdir')

let testFilePattern = /__tests__[\/\\]+.+\.test\.js$/i

walk.sync('src', function (path, stat) {
  if (testFilePattern.test(path)) {
    require(path)
  }
})

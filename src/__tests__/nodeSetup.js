global.assign   = require('lodash.assign');
global.sinon    = require('sinon');
global.chai     = require('chai');
global.expect   = global.chai.expect;
global.assert   = global.chai.assert;

global.chai.should();

global.chai.use(require('sinon-chai'));

// workaround to solve cache problems
var get = global._require = function (name) {
    delete require.cache[require.resolve(name)];
    return require(name);
};

global.window = {
  location: {
    protocol: 'https:',
    hostname: 'online.moysklad.ru',
    pathname: '/app/'
  },
  onhashchange: {}
};
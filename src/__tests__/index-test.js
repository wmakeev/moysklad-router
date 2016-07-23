'use strict'

const test = require('blue-tape')
const assign = require('lodash.assign')
const sinon = require('sinon')
const Router = require('../index')

const setup = () => {
  global.window = {
    location: {
      protocol: 'https:',
      hostname: 'online.moysklad.ru',
      pathname: '/app/'
    },
    onhashchange: {},
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy()
  }

  global.history = {
    replaceState: sinon.spy()
  }

  return { router: Router(), window: global.window }
}

const teardown = () => {
  delete global.window
  delete global.history
}

test('router', t => {
  t.equal(typeof Router, 'function', 'to be function')
  t.end()
})

test('router instance', t => {
  let router = Router()
  t.ok(router, 'is defined')
  t.equal(router.state, null, 'state is null')
  t.end()
})

test('router instance have', t => {
  let router = Router()
  let methods = [
    'start', 'stop', 'checkUrl', 'navigate', 'replaceState', 'refresh', 'getState',
    'getPath', 'getSection', 'getAction', 'getQuery', 'on', 'off'
  ]
  methods.forEach(m => t.equal(typeof router[m], 'function', `method "${m}"`))
  t.ok(router.VERSION, 'field VERSION')
  t.end()
})

test('router start throw error if no window.onhashchange', t => {
  let { router, window: win } = setup()
  delete win.onhashchange
  t.throws(router.start.bind(router), 'The browser not supports the hashchange event')
  teardown()
  t.end()
})

test('router start not throw if window.onhashchange exist', t => {
  let { router } = setup()
  t.doesNotThrow(router.start.bind(router))
  teardown()
  t.end()
})

test('router add and remove checkUrl event listener to hashchange event', t => {
  let { router, window: win } = setup()

  assign(win.location, {
    hash: '#warehouse/edit'
  })

  router.start()

  t.ok(win.addEventListener
    .calledWithExactly("hashchange", this.router.checkUrl, false)

  expect(router, 'router').property('state').to.be.ok;
  expect(router, 'router')
    .deep.property('state.path').to.be.equal('warehouse/edit');

  this.router.stop();
  expect(global.window.removeEventListener)
    .to.be.calledOnce.and
    .calledWith("hashchange", this.router.checkUrl);

  teardown()
  t.end()
})
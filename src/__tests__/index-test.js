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
  return { router: Router() }
}

const teardown = () => {
  delete global.window
  delete global.history
}

let withSetup = testFn => t => {
  let env = setup()
  env.assert = t
  let testResult = testFn(env)
  if (testResult === void 0) {
    teardown(env)
    t.end()
  }
  return testResult
}

test('router constructor', assert => {
  assert.equal(typeof Router, 'function', 'to be function')
  assert.end()
})

test('router', assert => {
  let router = Router()
  let methods = [
    'start', 'stop', 'checkUrl', 'navigate', 'replaceState', 'refresh', 'getState',
    'getPath', 'getSection', 'getAction', 'getQuery', 'on', 'off'
  ]
  assert.ok(router, 'is defined')
  assert.equal(router.state, null, 'state is null')
  methods.forEach(m => assert.equal(typeof router[m], 'function', `has method "${m}"`))
  assert.ok(router.VERSION, 'has field VERSION')
  assert.end()
})

test('router start throw error if no window.onhashchange', withSetup(({ assert, router }) => {
  delete window.onhashchange
  assert.throws(router.start.bind(router), 'The browser not supports the hashchange event')
}))

test('router start not throw if window.onhashchange exist', withSetup(({ assert, router }) => {
  assert.doesNotThrow(router.start.bind(router))
}))

test('router add and remove checkUrl event listener to hashchange event',
  withSetup(({ assert, router }) => {
    assign(window.location, {
      hash: '#warehouse/edit'
    })
    router.start()
    assert.ok(window.addEventListener
      .calledWithExactly('hashchange', router.checkUrl, false), 'add listener')
    assert.ok(router.state, 'state is defined')
    assert.equal(router.state.path, 'warehouse/edit')
    router.stop()
    assert.ok(window.removeEventListener.calledOnce, 'removeEventListener called once')
    assert.ok(window.removeEventListener.calledWith('hashchange', router.checkUrl))
  }))

test('router call all route handlers on checkUrl', withSetup(({ assert, router }) => {
  let spy1 = sinon.spy()
  let spy2 = sinon.spy()
  router.on('route', spy1)
  router.on('route', spy2)
  window.location.hash = '#demand'
  router.checkUrl()
  assert.ok(spy1.calledWithExactly(router.state, router), 'handler one called')
  assert.ok(spy2.calledWithExactly(router.state, router), 'handler tow called')
  assert.deepEqual(router.state, {
    path: 'demand',
    query: {}
  })
}))

// TODO 'should emit "start" event on router.start()'

// TODO 'should emit "stop" event on router.stop()'

test('router navigate to path', withSetup(({ assert, router }) => {
  router.start()
  router.navigate('demand/edit')
  assert.equal(window.location, 'https://online.moysklad.ru/app/#demand/edit')
}))

test('router navigate to path and query', withSetup(({ assert, router }) => {
  router.start()
  router.navigate('demand/edit', {
    name: 'value'
  })
  assert.equal(window.location, 'https://online.moysklad.ru/app/#demand/edit?name=value')
}))

test('router navigate to path and uuid', withSetup(({ assert, router }) => {
  router.start()
  router.navigate('demand/edit', '2642131c-2add-11e5-90a2-8ecb0006c965')
  assert.equal(window.location,
    'https://online.moysklad.ru/app/#demand/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965')
}))

test('router navigate to state', withSetup(({ assert, router }) => {
  // some state before router.navigate to other state
  window.location.hash = '#company/view?id=2642131c-2add-11e5-90a2-8ecb0006c963&some=value'
  router.start()
  router.navigate({
    path: 'invoiceOut/edit',
    query: {
      id: '2642131c-2add-11e5-90a2-8ecb0006c965'
    }
  })
  assert.equal(window.location,
    'https://online.moysklad.ru/app/#invoiceOut/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965')
}))

test('router navigate with patching current state', withSetup(({ assert, router }) => {
  window.location.hash = '#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965'
  router.start()
  router.navigate({
    query: {
      id: '2642131c-2add-11e5-90a2-8ecb0006c000'
    }
  }, true)
  assert.equal(window.location,
    'https://online.moysklad.ru/app/#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c000')
}))

test('router#getState value and router.state', withSetup(({ assert, router }) => {
  window.location.hash = '#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965'
  router.start()
  let state = router.getState()
  assert.notEqual(state, router.state)
  assert.deepLooseEqual(state, router.state)
}))

test('router methods', withSetup(({ assert, router }) => {
  window.location.hash = '#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965'
  router.start()
  assert.equal(router.getPath(), 'customerorder/edit', '#getPath returns hash path')
  assert.equal(router.getSection(), 'customerorder', '#getSection returns section from path')
  assert.equal(router.getAction(), 'edit', '#getAction returns action from path')
  assert.notEqual(
    router.getQuery(), router.state.query,
    '#getQuery not returns router.state.query by ref')
  assert.deepLooseEqual(
    router.getQuery(), { id: '2642131c-2add-11e5-90a2-8ecb0006c965' },
    '#getQuery returns cloned router.state.query')
}))

// TODO test replaceState

test('router#refresh replaceState with addition refresh param', withSetup(({ assert, router }) => {
  window.location.hash = '#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965'
  router.start()
  router.refresh()
  let url = history.replaceState.getCall(0).args[2]
  let testExp = /refresh=\d{13}/g
  assert.ok(testExp.test(url))
}))

// TODO methods should return this

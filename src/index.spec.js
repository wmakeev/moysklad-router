//var pkg = require('../package');
var Router = require('./index');

describe('moysklad-router', function () {

  it('should be defined function', function () {
    expect(Router)
      .to.be.ok.and
      .to.be.a('function');
  });

  describe('instance', function () {

    beforeEach(function () {
      assign(window, {
        location: {
          protocol: 'https:',
          hostname: 'online.moysklad.ru',
          pathname: '/app/',
          hash: '#customerorder/edit'
        },
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy()
      });
      global.history = {
        replaceState: sinon.spy()
      };
      this.router = Router();
    });

    it('should have methods', function () {

      //expect(this.router.VERSION)
      //  .to.be.ok.and
      //  .to.be.equal(pkg.version);

      expect(this.router.start)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.stop)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.checkUrl)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.navigate)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.replaceState)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.refresh)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.getState)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.getSection)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.getAction)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.state)
        .to.be.eql(null);

      expect(this.router.on)
        .to.be.ok.and
        .to.be.a('function');

      expect(this.router.off)
        .to.be.ok.and
        .to.be.a('function');
    });

    it('should throw error if no window.hashchange', function () {
      delete window.onhashchange;
      expect(this.router.start.bind(this.router))
        .to.throw('The browser not supports the hashchange event!');
      window.onhashchange = {};
    });

    it('should not throw if window.hashchange exist', function () {
      expect(this.router.start.bind(this.router))
        .to.not.throw();
    });

    it('should add and remove checkUrl event listener to hashchange event', function () {
      assign(window.location, {
        hash: '#warehouse/edit'
      });

      var router = this.router.start();

      expect(window).property('addEventListener')
        .calledWithExactly("hashchange", this.router.checkUrl, false);

      expect(router, 'router').property('state').to.be.ok;
      expect(router, 'router')
        .deep.property('state.path').to.be.equal('warehouse/edit');

      this.router.stop();
      expect(global.window.removeEventListener)
        .to.be.calledOnce.and
        .calledWith("hashchange", this.router.checkUrl);
    });

    it('should call all route handlers on checkUrl', function () {
      var spy1 = sinon.spy();
      this.router.on('route', spy1);

      var spy2 = sinon.spy();
      this.router.on('route', spy2);

      window.location.hash = '#demand';
      // checkUrl should be binded to this router
      this.router.checkUrl();

      var arg1 = {
        "path": "demand",
        "query": {}
      };

      expect(spy1).to.be.calledWithExactly(this.router.state, this.router);
      expect(spy2).to.be.calledWithExactly(this.router.state, this.router);

      expect(this.router.state).to.be.eql(arg1);
    });

    it('should emit "start" event on router.start()', function () {
      //TODO test start event
    });

    it('should emit "stop" event on router.stop()', function () {
      //TODO test stop event
    });

    it('should navigate to path', function () {
      this.router.start();
      this.router.navigate('demand/edit');
      expect(window.location).to.be.equal('https://online.moysklad.ru/app/#demand/edit');
    });

    it('should navigate to path and query', function () {
      this.router.start();
      this.router.navigate('demand/edit', {
        name: 'value'
      });
      expect(window.location)
        .to.be.equal('https://online.moysklad.ru/app/#demand/edit?name=value');
    });

    it('should navigate to path and uuid', function () {
      this.router.start();
      this.router.navigate('demand/edit', '2642131c-2add-11e5-90a2-8ecb0006c965');
      expect(window.location)
        .to.be.equal('https://online.moysklad.ru/app/#demand/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965');
    });

    it('should navigate to state', function () {
      this.router.start();
      this.router.navigate({
        path: 'invoiceOut/edit',
        query: {
          id: '2642131c-2add-11e5-90a2-8ecb0006c965'
        }
      });
      expect(window.location)
        .to.be.equal('https://online.moysklad.ru/app/#invoiceOut/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965');
    });

    it('should navigate by patching current state', function () {
      window.location.hash = '#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965';
      this.router.start();
      this.router.navigate({
        query: {
          id: '2642131c-2add-11e5-90a2-8ecb0006c000'
        }
      }, true);
      expect(window.location)
        .to.be.equal('https://online.moysklad.ru/app/#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c000');
    });

    it('should return current state', function () {
      window.location.hash = '#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965';
      this.router.start();
      var state = this.router.getState();
      expect(state).to.be.eql(this.router.state);
      expect(state).not.to.be.equal(this.router.state);
    });

    it('should return hash section', function () {
      window.location.hash = '#customerorder/edit';
      this.router.start();
      expect(this.router.getSection(), 'getSection')
        .to.be.equal('customerorder');
    });

    it('should return hash action', function () {
      window.location.hash = '#customerorder/edit';
      this.router.start();
      expect(this.router.getAction(), 'getAction')
        .to.be.equal('edit');
    });

    //TODO replaceState

    it('should return refresh page', function () {
      window.location.hash = '#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965';
      this.router.start();
      this.router.refresh();
      var url = history.replaceState.getCall(0).args[2].split('&refresh=');
      expect(url[0]).to.be.equal('https://online.moysklad.ru/app/#customerorder/edit?id=2642131c-2add-11e5-90a2-8ecb0006c965');
      expect(url[1].length).to.be.equal('1436969168623'.length);
    });


    //TODO methods should return this

  });

});
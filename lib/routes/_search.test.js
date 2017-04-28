'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./' + filename),
  expect = require('chai').expect,
  sinon = require('sinon'),
  elastic = require('../services/elastic'),
  responses = require('../services/responses');

function createMockRouter() {
  return {
    use: _.noop,
    all: _.noop,
    get: _.noop,
    put: _.noop,
    post: _.noop,
    delete: _.noop
  };
}

describe(_.startCase(filename), function () {
  let sandbox, router = createMockRouter();

  elastic.setup({
    search: _.noop
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(router);
    sandbox.stub(elastic);
    sandbox.stub(responses);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('routes', function () {
    it('adds a _search route', function () {
      lib(router);
      expect(router.post.calledOnce).to.be.true;
    });
  });

  describe('elasticPassthrough', function () {
    const fn = lib[this.title];

    it('queries Elastic', function () {
      var callback = fn({query: 'query'});

      sandbox.stub(elastic.client, 'search');
      callback();
      expect(elastic.client.search.calledWith({query: 'query'})).to.be.true;
    });
  });

  describe('response', function () {
    const fn = lib[this.title];

    it('calls the `expectJSON` function', function () {
      const req = {
          body: {
            query: 'query'
          }
        }, res = sandbox.stub();

      sandbox.stub(elastic.client, 'search');
      fn(req, res);
      expect(responses.expectJSON.calledOnce).to.be.true;
    });
  });
});
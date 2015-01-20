var _ = require('lodash'),
    Promise = require('bluebird'),
    rest = require('restler'),
    methods = ['request', 'get', 'post', 'put', 'del', 'head', 'patch', 'json', 'postJson', 'putJson'],
    serviceMethods = ['request', 'get', 'patch', 'put', 'post', 'json', 'del'],
    util = require('util');

function makePromise(request) {
  return new Promise(resolver)
    .cancellable()
    .catch(Promise.CancellationError, cancelled);

  function resolver(resolve, reject) {
    request.on("success", success);
    request.on("fail", fail);
    request.on("error", reject);
    request.on("timeout", timeout);

    function success(data, response) {
      return resolve({data: data, response: response});
    }

    function fail(data, response) {
      return reject({data: data, response: response});
    }

    function timeout(ms) {
      return reject({timeout: ms});
    }
  }

  function cancelled(err) {
    request.abort(err);
    throw err;
  }
}

function wrap(source, target, method) {
  target[method] = _.compose(makePromise, source[method]);
}

function PromiseService(defaults) {
  rest.Service.call(this, defaults);
}
util.inherits(PromiseService, rest.Service);

_.each(serviceMethods, _.bind(wrap, null, rest.Service.prototype, PromiseService.prototype));

function service(constructor, defaults, userMethods) {
  constructor.prototype = new PromiseService(defaults || {});
  _.merge(constructor.prototype, userMethods);
  return constructor;
}

// Exports

module.exports = {
  parsers: rest.parsers,
  service: service
};
_.each(methods, _.bind(wrap, null, rest, module.exports));

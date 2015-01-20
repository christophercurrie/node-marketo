var _ = require('lodash'),
    Promise = require('bluebird'),
    rest = require('restler'),
    methods = ['request', 'get'];

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

_.each(methods, function(method) {
  module.exports[method] = invoke;

  function invoke() {
    var args = Array.prototype.slice.apply(arguments);
    return makePromise(rest[method].apply(rest, args));
  }
});

var assert = require('assert'),
    replay = require('replay'),
    rest = require('../lib/rest');

describe('PromiseRequest', function() {
  describe('get', function() {
    it('handles success', function(done) {
      var url = "http://httpbin.org/get";
      rest.get("http://httpbin.org/get")
        .then(function(res){
          assert.equal(res.data.url, url);
          done();
        })
        .catch(done);
    });

    it('handles 400 failure', function(done) {
      var url = "http://httpbin.org/status/418";
      rest.get(url)
        .then(function() {
          assert(false, "Should not have been resolved")
        })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    });

    it('handles 500 failure', function(done) {
      var url = "http://httpbin.org/status/500";
      rest.get(url)
        .then(function() {
          assert(false, "Should not have been resolved")
        })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 500);
          done();
        })
        .catch(done);
    });

    //it('handles timeout', function(done){
    //  var timeout = 500,
    //      promise = rest.get("http://httpbin.org/delay/1", {timeout: timeout});
    //  promise
    //    .then(function() {
    //      assert(false, "Should have caught timeout error");
    //    })
    //    .catch(assert.AssertionError, done)
    //    .catch(function (res) {
    //      assert.equal(res.timeout, timeout);
    //      done();
    //    })
    //    .catch(done);
    //});
  })
});

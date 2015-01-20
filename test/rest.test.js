var assert = require('assert'),
    Promise = require('bluebird'),
    replay = require('replay'),
    rest = require('../lib/rest');

describe('RestPromise', function() {
  describe('get', function() {
    it('handles success', function(done) {
      var url = 'http://httpbin.org/get';
      rest.get(url)
        .then(function(res){
          assert.equal(res.data.url, url);
          done();
        })
        .catch(done);
    });

    it('handles 400 failure', function(done) {
      var url = 'http://httpbin.org/status/418';
      rest.get(url)
        .then(function() {
          assert(false, 'Should not have been resolved')
        })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    });

    it('handles 500 failure', function(done) {
      var url = 'http://httpbin.org/status/500';
      rest.get(url)
        .then(function() {
          assert(false, 'Should not have been resolved')
        })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 500);
          done();
        })
        .catch(done);
    });

    it('handles redirects', function(done){
      var url = 'http://httpbin.org/redirect/3';
      rest.get(url)
        .then(function(res){
          assert.equal(res.data.url, 'http://httpbin.org/get');
          done();
        })
        .catch(done);
    });

    it('supports cancellation', function(done){
      var url = 'http://httpbin.org/get';
      rest.get(url)
        .then(function(){
          assert(false, 'Should have been cancelled')
        })
        .catch(Promise.CancellationError, function(){done();})
        .catch(done)
        .cancel();
    });

    // node-replay can't currently simulate latency

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
  });

  describe('post', function(){
    it('supports success', function(done){
      var url = 'http://httpbin.org/post',
          data = {message: 'maker as fsck'};

      rest.post(url, {data: JSON.stringify(data), headers: {'content-type': 'application/json'}})
        .then(function(res){
          assert.equal(res.data.json.message, data.message);
          done();
        })
        .catch(done);
    });

    it('supports failure', function(done) {
      var url = 'http://httpbin.org/status/418',
          data = {message: 'maker as fsck'};

      rest.post(url, {data: data})
        .then(function() { assert(false, 'Should not have succeeded'); })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    })
  });

  describe('put', function(){
    it('supports success', function(done){
      var url = 'http://httpbin.org/put',
        data = {message: 'maker as fsck'};

      rest.put(url, {data: JSON.stringify(data), headers: {'content-type': 'application/json'}})
        .then(function(res){
          assert.equal(res.data.json.message, data.message);
          done();
        })
        .catch(done);
    });

    it('supports failure', function(done) {
      var url = 'http://httpbin.org/status/418',
        data = {message: 'maker as fsck'};

      rest.put(url, {data: data})
        .then(function() { assert(false, 'Should not have succeeded'); })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    })
  });

  describe('delete', function(){
    it('supports success', function(done){
      var url = 'http://httpbin.org/delete',
        data = {message: 'maker as fsck'};

      rest.del(url, {data: JSON.stringify(data), headers: {'content-type': 'application/json'}})
        .then(function(res){
          assert.equal(res.data.json.message, data.message);
          done();
        })
        .catch(done);
    });

    it('supports failure', function(done) {
      var url = 'http://httpbin.org/status/418',
        data = {message: 'maker as fsck'};

      rest.del(url, {data: data})
        .then(function() { assert(false, 'Should not have succeeded'); })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    })
  });

  describe('head', function(){
    it('supports success', function(done){
      var url = 'http://httpbin.org/get';

      rest.head(url)
        .then(function(res){
          assert.equal(res.response.headers['content-type'], 'application/json');
          done();
        })
        .catch(done);
    });

    it('supports failure', function(done) {
      var url = 'http://httpbin.org/status/418';

      rest.head(url)
        .then(function() { assert(false, 'Should not have succeeded'); })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    })
  });

  describe('patch', function(){
    it('supports success', function(done){
      var url = 'http://httpbin.org/patch',
        data = {message: 'maker as fsck'};

      rest.patch(url, {data: JSON.stringify(data), headers: {'content-type': 'application/json'}})
        .then(function(res){
          assert.equal(res.data.json.message, data.message);
          done();
        })
        .catch(done);
    });

    it('supports failure', function(done) {
      var url = 'http://httpbin.org/status/418',
        data = {message: 'maker as fsck'};

      rest.patch(url, {data: data})
        .then(function() { assert(false, 'Should not have succeeded'); })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    })
  });
});

describe('RestService', function(){
  var defaults = {
      baseURL: 'http://httpbin.org'
    },
    methods = {
      getSuccess: function() { return this.get('/get'); },
      getFailure: function() { return this.get('/status/418');}
    },
    HttpBinService = rest.service(ctor, defaults, methods),
    service = null;

  function ctor() {
    this.defaults.user = 'usermind';
  }

  beforeEach(function() {
    service = new HttpBinService();
  });

  describe('get', function(){
    it('supports success', function(done){
      service.getSuccess()
        .then(function(res) {
          assert.equal(res.data.url, 'http://httpbin.org/get');
          done();
        })
        .catch(done);
    });

    it('supports failure', function(done) {
      service.getFailure().then(function() { assert(false, 'Should not have succeeded'); })
        .catch(assert.AssertionError, done)
        .catch(function(res) {
          assert.equal(res.response.statusCode, 418);
          done();
        })
        .catch(done);
    })

  });
});

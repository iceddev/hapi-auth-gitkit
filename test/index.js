'use strict';

var lab = exports.lab = require('lab').script();
var expect = require('code').expect;
var hapi = require('hapi');

var hapiAuthGitkit = require('../');

var experiment = lab.experiment;
var beforeEach = lab.beforeEach;
var test = lab.test;

experiment('hapi-auth-gitkit', function(){

  var server;

  beforeEach(function(done){
    server = new hapi.Server();
    server.connection();
    server.register(hapiAuthGitkit, done);
  });

  test('can be configured without a client', function(done){
    server.auth.strategy('gitkit', 'gitkit');
    done();
  });

  test('defaults to cookie name of `gtoken`', function(done){
    var client = {
      verifyGitkitToken: function(key, cb){
        expect(key).to.equal('12345');
        cb(null, {});
      }
    };

    server.auth.strategy('gitkit', 'gitkit', {
      client: client
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: function(req, reply){
        reply('ok');
      },
      config: {
        auth: 'gitkit'
      }
    });

    var request = {
      method: 'POST',
      url: '/',
      headers: {
        cookie: 'gtoken=12345'
      }
    };

    server.inject(request, function(res){
      expect(res.result).to.equal('ok');
      done();
    });
  });

  test('allows custom cookie name using `cookieName` config', function(done){
    var client = {
      verifyGitkitToken: function(key, cb){
        expect(key).to.equal('abcde');
        cb(null, {});
      }
    };

    server.auth.strategy('gitkit', 'gitkit', {
      cookieName: 'cookieName',
      client: client
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: function(req, reply){
        reply('ok');
      },
      config: {
        auth: 'gitkit'
      }
    });

    var request = {
      method: 'POST',
      url: '/',
      headers: {
        cookie: 'cookieName=abcde'
      }
    };

    server.inject(request, function(res){
      expect(res.result).to.equal('ok');
      done();
    });
  });

  test('allows custom cookie name using `cookie` config', function(done){
    var client = {
      verifyGitkitToken: function(key, cb){
        expect(key).to.equal('qwerty');
        cb(null, {});
      }
    };

    server.auth.strategy('gitkit', 'gitkit', {
      cookie: 'cookie',
      client: client
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: function(req, reply){
        reply('ok');
      },
      config: {
        auth: 'gitkit'
      }
    });

    var request = {
      method: 'POST',
      url: '/',
      headers: {
        cookie: 'cookie=qwerty'
      }
    };

    server.inject(request, function(res){
      expect(res.result).to.equal('ok');
      done();
    });
  });

  test('returns 401 when cookie is missing', function(done){
    server.auth.strategy('gitkit', 'gitkit');

    server.route({
      method: 'POST',
      path: '/',
      handler: function(req, reply){
        reply('ok');
      },
      config: {
        auth: 'gitkit'
      }
    });

    var request = {
      method: 'POST',
      url: '/',
      headers: {
        cookie: 'nocookie=qwerty'
      }
    };

    server.inject(request, function(res){
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

  test('returns 401 when token verify responds with an error', function(done){
    var client = {
      verifyGitkitToken: function(key, cb){
        expect(key).to.equal('qwerty');
        cb(new Error('Invalid'));
      }
    };

    server.auth.strategy('gitkit', 'gitkit', {
      cookie: 'cookie',
      client: client
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: function(req, reply){
        reply('ok');
      },
      config: {
        auth: 'gitkit'
      }
    });

    var request = {
      method: 'POST',
      url: '/',
      headers: {
        cookie: 'cookie=qwerty'
      }
    };

    server.inject(request, function(res){
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

});

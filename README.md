# hapi-auth-gitkit

[![Travis Build Status](https://img.shields.io/travis/iceddev/hapi-auth-gitkit/master.svg?label=travis&style=flat-square)](https://travis-ci.org/iceddev/hapi-auth-gitkit)

Hapi plugin providing a Google Identity Toolkit scheme

## Usage

With a custom Gitkit client

```js
var path = require('path');
var GitkitClient = require('gitkitclient');

var client = new GitkitClient({
  clientId: 'YOUR_CLIENT_ID',
  serviceAccountEmail: 'YOUR_SERVICE_ACCOUNT_EMAIL',
  serviceAccountPrivateKeyFile: path.join(__dirname, 'privateKey.pem'),
  widgetUrl: 'http://localhost:8000/gitkit'
});

server.register(require('hapi-auth-gitkit'), function(err){

  server.auth.strategy('gitkit', 'gitkit', {
    // Cookie name of auth token
    cookie: 'gtoken',
    client: client
  });
  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'gitkit'
    }
  });
});
```

Without a custom Gitkit client

```js
server.register(require('hapi-auth-gitkit'), function(err){

  server.auth.strategy('gitkit', 'gitkit', {
    // Cookie name of auth token
    cookie: 'gtoken'
    // Gitkit Client Config
    clientId: 'YOUR_CLIENT_ID',
    serviceAccountEmail: 'YOUR_SERVICE_ACCOUNT_EMAIL',
    serviceAccountPrivateKeyFile: path.join(__dirname, 'privateKey.pem'),
    widgetUrl: 'http://localhost:8000/gitkit',
  });
  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'gitkit'
    }
  });
});
```

## API

The `'gitkit'` scheme takes the following options:

### `cookieName`/`cookie` (Default: 'gtoken')

The name of the cookie where the user token will be stored. This is retrieved and verified during
authentication.

### `client`

A custom Gitkit client instance can be passed. This option is useful for using a single Gitkit instance
throughout the server.

### `clientId`

The client id for your Gitkit application. Not used if the `client` option is used.

### `serviceAccountEmail`

The service account email for your Gitkit application. Not used if the `client` option is used.

### `serviceAccountPrivateKeyFile`

The location of your private key for your Gitkit application. Not used if the `client` option is used.

### `widgetUrl`

The location of your login widget for your Gitkit application. Not used if the `client` option is used.

## License

MIT

'use strict';

var boom = require('boom');
var GitkitClient = require('gitkitclient');

function gitkitScheme(server, opts){
  var cookieKey = opts.cookieName || opts.cookie || 'gtoken';

  var gitkitClient;
  if(opts.client){
    gitkitClient = opts.client;
  } else {
    gitkitClient = new GitkitClient(opts);
  }

  return {
    authenticate: function(request, reply){

      if(!request.state[cookieKey]){
        reply(boom.unauthorized(null, 'Gitkit'));
        return;
      }

      gitkitClient.verifyGitkitToken(request.state[cookieKey], function(err, credentials){
        if(err){
          reply(err);
          return;
        }

        reply.continue({ credentials: credentials });
      });
    }
  };
}


function hapiAuthGitkit(server, opts, done){

  server.auth.scheme('gitkit', gitkitScheme);
  done();
}

hapiAuthGitkit.attributes = {
  pkg: require('./package.json')
};

module.exports = {
  register: hapiAuthGitkit
};

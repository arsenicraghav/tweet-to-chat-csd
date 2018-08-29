const request = require('request-promise')
const auth = require('../helpers/auth.js')

var sub_request_options = {
  url: 'https://api.twitter.com/1.1/account_activity/all/' + auth.twitter_webhook_environment + '/subscriptions.json',
  oauth: auth.twitter_oauth,
  resolveWithFullResponse: true
}

var actions = {}

actions.addsub = function (user) {
  var data = {
      id : user.profile.id,
      username : user.profile.username ,
      displayName : user.profile.displayName
  };
  sub_request_options.oauth.token = user.access_token
  sub_request_options.oauth.token_secret = user.access_token_secret
  var localPromise = new Promise(function (resolve, reject) {
      request.post(sub_request_options).then(
          resolve(data)
      );
  });
  return localPromise;
}

module.exports = function (req, resp) {
  if (actions[req.params.action]) {
    actions[req.params.action](req.user).then(function (response) {
        resp.redirect('/success/'+response.id+'/'+response.username + '/'+response.displayName);
    }).catch(function (response) {
      resp.status(500);
      resp.send('internal server error');
    })
  } else {
    resp.status(404);
    resp.send('invalid action');
  }
}


process.env.XS_APP_LOG_LEVEL = "error";
process.env.REQUEST_TRACE = true;

const approuter = require('@sap/approuter');
const xsenv = require('@sap/xsenv');
const request = require('request');
const url = require('url');

var requestUserToken = function requestUserToken(uaaService, callback) {

  var account = JSON.parse(process.env.account);
  var tokenSubdomain = account.subDomain;
  var urlWithCorrectSubdomain = uaaService.url;
  var tokenRequestSubdomain = null;
  var uaaUrl = url.parse(uaaService.url);
  if (uaaUrl.hostname.indexOf('.') === -1) {
    tokenRequestSubdomain = null;
  } else {
    tokenRequestSubdomain = uaaUrl.hostname.substring(0, uaaUrl.hostname.indexOf('.'));
  }
  if (tokenSubdomain !== null && tokenRequestSubdomain != null && tokenSubdomain !== tokenRequestSubdomain) {
    urlWithCorrectSubdomain = uaaUrl.protocol + "//" + tokenSubdomain + uaaUrl.host.substring(uaaUrl.host.indexOf('.'), uaaUrl.host.size);
  }

  var options = {
    url: urlWithCorrectSubdomain + '/oauth/token?grant_type=password&username=' + account.username + '&password=' + account.password,
    auth: {
      user: uaaService.clientid,
      pass: uaaService.clientsecret
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 20000
  };
  console.log("Options:" + JSON.stringify(options));
  request.post(
    options,
    function (error, response, body) {
      console.log(response.statusCode);
      if (error || response.statusCode !== 200) {
        console.log('error:' + error);
        console.log('Token request failed');
        callback(new Error("Token request failed."));
        return;
      }

      var json = null;
      try {
        json = JSON.parse(body);
        callback(null, json.access_token);
      } catch (e) {
        return callback(e);
      }
    }
  );
}

var start = function () {
  xsenv.loadEnv();

  var services = JSON.parse(process.env.VCAP_SERVICES);
  const uaa = services["epd-specification-c1"][0].credentials.uaa;

  requestUserToken(uaa, function (error, userToken) {
    if (error) {
      console.error("Failed to request user token." + error);
      return;
    }

    var router = approuter();
    router.beforeRequestHandler.use('/', function myMiddleware(req, res, next) {
      console.log(userToken);
      //local profile
      req.headers.authorization = 'Bearer ' + userToken;
      next();
    });

    router.start();

  });


};

start();


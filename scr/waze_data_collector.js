//collect road notification
var moment = require('./node_modules/moment')
var request = require('./node_modules/request');
 
var requestSettings = {
    method: 'GET',
    url: 'http://localhost:8080/waze/traffic-notifications?latBottom=40.247682&latTop=39.770927&lonLeft=-83.341293&lonRight=-82.704558',
    encoding: null
  }

 
function collectNotification() {
  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var now = Math.floor(new Date().getTime()/(1000*60))*60;
      console.log(now)
      require('fs').writeFile('../data/roadnotifications/rn' + now + '.json', body, 'utf8', function (err) {
        if (err) {
          console.error(err);
        }
      }
      );
    }
  });
}
 
var interval = setInterval(collectNotification, 60000);

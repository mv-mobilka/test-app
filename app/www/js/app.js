/*
** FS CORDOVA
*/
angular.module('fsCordova', [])
.service('CordovaService', ['$document', '$q', function($document, $q) {

  var d = $q.defer(),
      resolved = false;

  this.ready = d.promise;

  document.addEventListener('deviceready', function() {
    resolved = true;
    d.resolve(window.cordova);
  });

  // Check to make sure we didn't miss the 
  // event (just in case)
  setTimeout(function() {
    if (!resolved) {
      if (window.cordova) {
        d.resolve(window.cordova);
      }
    }
  }, 3000);
}]);

/*
** JSNLOG
*/
angular.module('logToServer', [])
.factory('$log', function () {
  var appender1= JL.createAjaxAppender().setOptions({
    "url":"http://192.168.100.222/server/api/jsnlog",
//    "url":"http://172.16.10.3/mv-mobilka/mv-co-delat-kdyz/be/server/api/jsnlog",
    "bufferSize": 100,
    "storeInBufferLevel": JL.getAllLevel(),
    "level": JL.getWarnLevel(),
    "sendWithBufferLevel": JL.getWarnLevel()
  });
  var logger = JL('Angular').setOptions({"appenders": [appender1]});
  var service = {
    DEBUG: JL.getDebugLevel(),
    INFO: JL.getInfoLevel(),
    WARN: JL.getWarnLevel(),
    ERROR: JL.getErrorLevel(),
    FATAL: JL.getFatalLevel(),
  };

  service.log = function ( level, msg) {
    console.log('JSNLOG', level, msg);
    logger.log( level, JSON.prune(msg));
  };

  service.debug = function (msg) {
    service.log( service.DEBUG, msg);
  };
  service.info = function (msg) {
    service.log( service.INFO, msg);
  };
  service.warn = function (msg) {
    service.log( service.WARN, msg);
  };
  service.error = function (err) {
    var msg = {
      message: err.message,
      stack: err.stack,
      raw: err
    };
    service.log( service.ERROR, msg);
  };
  service.send = function () {
    service.log( service.FATAL, {});
  };

  return service;
});

/*
** MAIN APP
*/
angular.module('myApp', ['fsCordova', 'logToServer'])
.controller('MyController', ['$scope', 'CordovaService', '$log', function ($scope, CordovaService, $log) {
  console.log('MyController');

  $scope.greetMe = 'World';
  $scope.sendLog = function () { $log.send(); };

  $log.info({
    fce: 'App.start',
    navigator: {
      platform:       navigator.platform,
      cookieEnabled:  navigator.cookieEnabled,
      doNotTrack:     navigator.doNotTrack,
      geolocation:    navigator.geolocation,
      product:        navigator.product,
      productSub:     navigator.productSub,
      userAgent:      navigator.userAgent,
      vendor:         navigator.vendor
    }
  });

  CordovaService.ready.then( function() {
    console.log('CordovaService.ready');


    /*
    * GEOLOCATION
    * https://cordova.apache.org/docs/en/3.0.0/cordova_geolocation_geolocation.md.html
    * Na androidu je treba povolit Nastaveni>Pristup k poloze
    */
    navigator.geolocation.getCurrentPosition(
      function geoSuccess(position) {
        $scope.position = position;
        $scope.$apply();
      },
      function geoError(error) {
        var message;
        switch (error.code) {
          case 1: 
            message = 'You haven\'t shared your location.';
            break;
          case 2:
            message = 'Couldn\'t detect your current location.';
            break;
          case 3:
            message = 'Retrieving your position timeouted.';
            break;
          default:
            message = 'Retrieving your position failed for unknown reason. Error code: ' + error.code + '. Error message: ' + error.message;
        }
        alert( message );
      }, 
      { 
        timeout: 30000,
        enableHighAccuracy: true,
        frequency: 10000
      });


    /*
    ** ACCELEROMETER
    */




    navigator.accelerometer.watchAcceleration(
      function accSuccess(acceleration) {
        $scope.acceleration = acceleration;
        $scope.$apply();
      },
      function accError() {
        alert('accError!');
      },
      { 
        frequency: 3000
      });

    /*
    * Notification
    * https://cordova.apache.org/docs/en/3.0.0/cordova_notification_notification.md.html#Notification
    */
    function alertDismissed() {
      // do something
    }

    navigator.notification.alert(
      'You are the winner!',  // message
      alertDismissed,         // callback
      'Game Over',            // title
      'Done'                  // buttonName
    );
    window.alert = navigator.notification.alert;

    /*
    ** Calendar
    ** !! Jen IOS a Android
    */

    var startDate = new Date(2014,9,2,18,30,0,0,0); // beware: month 0 = january, 11 = december
    var endDate = new Date(2014,9,2,19,30,0,0,0);
    var title = "TEST";
    var location = "praha";
    var notes = "Need to do a skype meeting with the lead.";
    var calSuccess = function(message) { alert("Caledar event added: " + JSON.stringify(message)); };
    var calError = function(message) { alert("Caledar event Error: " + message); };

    window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,calSuccess,calError);

    $scope.device = device;
  });
}]);

var start = {
  deviceReady: false,
  documentReady: false,
  onReady: function onReady(event) {
    console.log(event + ' READY');
    start[event] = true;
    if (start.deviceReady || start.documentReady) {
      console.log('starting Angular');
      angular.bootstrap( document, ['myApp']);
      delete start.onReady;
      start.onReady = function onReadyFoo() {};
    }
  }
};
document.addEventListener('deviceready', start.onReady('deviceReady'));
document.addEventListener('ready', start.onReady('documentReady'));

function test_scan() {
  cordova.plugins.barcodeScanner.scan(
    function (result) {
        alert("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);
    }, 
    function (error) {
        alert("Scanning failed: " + error);
    }
  );
}
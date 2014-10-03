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
.service('$log', function () {
  var appender1= JL.createAjaxAppender().setOptions({
    "url":"http://localhost/server/api/jsnlog",
    "bufferSize": 100,
    "storeInBufferLevel": JL.getAllLevel(),
    "level": JL.getWarnLevel(),
    "sendWithBufferLevel": JL.getWarnLevel()
  });
  var appender2= JL.createConsoleAppender();
  this.logger = JL('Angular').setOptions({"appenders": [appender1, appender2]});

  this.log = function ( level, msg) {
    this.logger.log( level, msg);
  };
  this.debug = function (msg) {
    this.logger.debug(msg);
  };
  this.info = function (msg) {
    this.logger.info(msg);
  };
  this.warn = function (msg) {
    this.logger.warn(msg);
  };
  this.error = function (msg) {
    this.logger.error(msg);
  };
  this.DEBUG = JL.getDebugLevel();
  this.INFO = JL.getInfoLevel();
  this.WARN = JL.getWarnLevel();
  this.ERROR = JL.getErrorLevel();
  this.FATAL = JL.getFatalLevel();
});

/*
** MAIN APP
*/
angular.module('myApp', ['fsCordova', 'logToServer'])
.controller('MyController', ['$scope', 'CordovaService', function ($scope, CordovaService, $log) {
  console.log('MyController');

  $scope.greetMe = 'World';

  $log.log( $log.FATAL, "Starting Angular APP" );

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

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

angular.module('myApp', ['fsCordova'])
.controller('MyController', ['$scope', 'CordovaService', function ($scope, CordovaService) {
  console.log('MyController');

  $scope.greetMe = 'World';

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

  });
}]);

var onDeviceReady = function() {
  console.log('event: onDeviceReady');
  angular.bootstrap( document, ['myApp']);
  document.removeEventListener('deviceready');
};
document.addEventListener('deviceready', onDeviceReady);
//angular.element(document).ready(function() {
//  angular.bootstrap(document, ['myApp']);
//});
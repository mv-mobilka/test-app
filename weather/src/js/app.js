angular.module('WeatherApp', [
  'ngRoute',
  'ngTouch',
  'mobile-angular-ui',
  'WeatherApp.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'home.html'});
});
angular.module('WeatherApp.controllers.Main', [
  'WeatherApp.services.Geolocation',
  'WeatherApp.services.Forecast'
  ])

.controller('MainController', function($scope, getCurrentPosition, getWeather){
  getCurrentPosition(function(position){
    getWeather(
      position.coords.latitude, 
      position.coords.longitude, 
      function(location, weather){
        $scope.location = location;
        $scope.weather = weather;
      });
  });
});
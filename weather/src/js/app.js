angular.module('WeatherApp', [
  'ui.router',
  'ngAnimate',
  'ngTouch',
  'mobile-angular-ui',
  'WeatherApp.controllers.Main'
])

.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("home");
  //
  // Now set up the states
  $stateProvider
  .state('home', {
    url: "/",
    templateUrl: "home.html"
  })
  .state('page1', {
    url: "/1",
    templateUrl: "page1.html"
  })
});

module.exports = function(config) {

  // Output directory
  config.dest = 'www';

  // Inject cordova script into html
  config.cordova = true;

  // Images minification
  config.minify_images = true;

  // Development web server
  // Setting to false will disable it
  config.server = {
    host: '192.168.100.222',
    port: '3333'
  };

  // Weinre Remote debug server
  // Setting to false will disable it
  config.weinre = {
    httpPort:     8888,
    boundHost:    '192.168.100.222',
    verbose:      true,
    debug:        true,
    readTimeout:  5,
    deathTimeout: 15
  };

  // 3rd party components
  // config.vendor.js.push('.bower_components/lib/dist/lib.js');
  // config.vendor.fonts.push('.bower_components/font/dist/*');

};
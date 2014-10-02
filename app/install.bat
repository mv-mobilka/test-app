call npm install -g phonegap
call bower install

@rem http://docs.phonegap.com/en/3.5.0/guide_cli_index.md.html#The%20Command-Line%20Interface
call phonegap plugin add org.apache.cordova.device-motion
call phonegap plugin add org.apache.cordova.device-orientation
call phonegap plugin add org.apache.cordova.geolocation
call phonegap plugin add org.apache.cordova.console
call phonegap plugin add org.apache.cordova.splashscreen
call phonegap plugin add com.phonegap.plugins.barcodescanner
call phonegap plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git
call phonegap plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git
call phonegap plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git

call phonegap build android
call phonegap build wp8

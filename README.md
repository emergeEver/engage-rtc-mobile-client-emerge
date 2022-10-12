# engage-rtc-mobile-client-emerge
React Native RTC application

## react-native-app installation Instructions:
 
### Installation
This section describes how to install the required dependencies and get the project working.

### Prerequisite
**Android:**
- To run the application in android, we need an Android SDK Manager and Emulator `(AVD Manager -> Virtual Device)` with standard configuration.
	
**iOS:**
- Xcode and Simulator

### Installing Dependencies:
- Make sure you have node.js installed in your system.
- Open command prompt and navigate to project directory.
- Run `npm install` command to install all required dependencies.
	
### Run App in Android Emulator: 
- Run `npx react-native run-android` for running the application in android. 
	
### Run App in Simulator iOS: 
- Run `cd ios&&pod install` command in terminal
- Use `npx react-native run-iOS` command for running the application in iOS.
	
## Create an installer/APK :
### Android:  
- Open command prompt in android directory or navigate to `<project_directory>/android` and run `gradlew assembleRelease`.\ This command will create .apk file which can be distributed and installed to the android device.
		  
### iOS:
- Navigate to `project_directory-> ios` and open `"edrna.xcworkspace"` file in xcode.
- Make sure your iphone is connected to your system and listed under devices in xcode.
- Select your device and hit the play button in xcode which will start building the application, once build get success, you can find the app in your iphone.

## Publish build:
### Android:
- Generally the Play Store accepts `android app bundle (.aab)` file as a strand distribution for android. Please refer [Signed APK Android](https://reactnative.dev/docs/signed-apk-android) for creating signed `.aab` file.
		
### iOS: 
- To create an archive, you can select anyDevice option in xcode and select the Archive from Product tab from top menu bar. once the Archive is ready the xcode will prompt the options to distribute/publish the app.	
		
For more details please refer the complete [react-native guide](https://reactnative.dev/docs/getting-started)

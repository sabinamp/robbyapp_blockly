# App to control the robot from explore-it

## Installation

This is the entire source code of the terminal app. It is based on [react-native](https://facebook.github.io/react-native/).

To build the app run

```
$ npm install
```

or

```
$ yarn install
```

This will download and install all dependencies into directory ``node_modules``.

# Development Environment

You'll need [Node](https://nodejs.org/en/download/), the [React Native CLI](https://facebook.github.io/react-native/docs/getting-started#the-react-native-cli) and a Text Editor like [Visual Studio Code](https://code.visualstudio.com/). That's all!

More information can be found on [React Native's Website](https://facebook.github.io/react-native/docs/getting-started). **The app does NOT use [Expo](https://expo.io/)!**

## Run App on Android

**NOTE**: You will need [Java 8](https://facebook.github.io/react-native/docs/getting-started#java-development-kit).

Have an Android emulator running (quickest way to get started), or a device connected

```
$ emulator -list-avds
Nexus_6_API_25
$ emulator @Nexus_6_API_25
$ react-native run-android
```

## Run App on iOS

No need to start a simulator first! Run command

```
$ react-native run-ios
```

to start simulator (from Xcode) and deploy app or deploy app onto attached iPhone.

**NOTE**:

- Several starts are needed for the first time! The whole compilation cycle takes too long to finish in time.
- **Signing** properties in Xcode are needed. Start Xcode and go to "Signing" paragraph.

# Hints for BLE support

The library used in this project to support BLE is: https://github.com/Polidea/react-native-ble-plx
```
$ npm install --save react-native-ble-plx
$ react-native link react-native-ble-plx
$ npm install --save react-native-gesture-handler
$ react-native link react-native-gesture-handler
$ npm install -save react-native-vector-icons
$ react-native link react-native-vector-icons

$ npm install
```


## Found UIDs

```
service uuid:        0000ffe0-0000-1000-8000-00805f9b34fb
characteristic uuid: 0000ffe1-0000-1000-8000-00805f9b34fb
```



### RN Version 0.58.5

Task: 
 - Renaming of project and upgrading from v0.57.8 to v0.58.5

Actions: 
- Start new React Native project from scratch with new name 'terminal' and copy all missing artefacts from the old project.
- Copy image assets for android from `android/app/src/main/res` and for ios from `ios/terminal/Images.xcassets/AppIcon.appiconset`
- Link `appcenter`
- iOS: Check if cocoa pods is installed. If not install it `sudo gem install cocoapods`

```
$ react-native init robbyapp
$ cd robbyapp
$ yarn install
$ react-native link

```

Read project [react-native-plx-ble](https://github.com/Polidea/react-native-ble-plx) carefully. Their are some updates needed 
    
 - for Android in `app/build.gradle` and `AndroidManifest.xml`!
 - for iOS. Open Xcode and add empty Swift file

# Adding AppCenter

To distribute the App during the development cycle the Cloud Service [AppCenter](https://visualstudio.microsoft.com/de/app-center/) will be used.


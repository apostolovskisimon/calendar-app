This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Info

I only have access to an Android device (Android 14), I don't have a Mac either.
This means the app only works on Android devices.
I added some installations for iOS but I couldn't do all fixes there and might have missed some
stuff due to time constraints and no access to preview.

App only works online, while I do know how to make it offline using NetInfo and listening to state,
its not a requirement and I'm bound by time.

**Date received of task: Fri, Oct 18, 5:10 PM**

**Date submission of task: Fri, Oct 25, 5:30 PM**

## My setup

- Android SDK 14 and Build Tools v14.
- Gradle 8.8, Groovy 3.0.21
- JVM 17.0.12
- NPM version 9.1.3
- NodeJS version 20.18.0

### App

- App is made in react native (no expo) version 0.75.4.
- Registration and login is through **Firebase** with email and password. (Client side auth rules only (pw lenght etc))
- For logging in (on each app start) there is biometrics request (thru React Native Keychain). (In my case only fingerprint was allowed, but detection and config is set to auto)
- Uses react navigation (stack and tabs) for navigation + Android only native drawer in Events page for filtering options.
- All forms are using **Formik and Yup for validation**.
- On submit shows errors beneath the inputs and if submit fails show toast messages.
- Events page is using react-native-big-calendar. Can change between view modes (day, week, month) and option to go to previous page or next.
- Clicking on an event grid date or an event already created pops up a modal to create/edit/delete.
- All events are saved and modifiable through **Firebase Cloud Firestore**
- All events are loaded always (can be made to be filtered through Firestore, but not due to time constraints.)
- Push notifications from notifee (only on CRUD events operations) and toasts for errors/successes are shown.
- Profile page by default is in view mode, after enabling Edit mode you can modify personal data and password. All submits are biometrics first confirmed.
- Logout clears user data, storage and signOut from firebase/auth.
- Scroll down to refresh on landing screen and on events to refresh data or ask for biometrics again

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Install dependencies

`npm i --force` in the root folder. `--force` became required after installing firestore in the app.

## Step 2: Start the Metro Server

Then, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

Either `npx react-native start --experimental-debugger` to start Metro with the new debugger or `npm start` then
in another terminal `npm run android`

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

After Metro is done, multiple options are shown to start the app on Android/iOS, debug etc.
I just press a to start on android.

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## App folders and files

1. Root level App.tsx contains the navigation/safe area containers, theme providers and context wrappers.
2. src/App folder has returns the Screen Stacks shown to the user depending if is logged in (Private) or not (Public)
3. src/context has the Auth(everything from register, login, biometrics, edit profile, logout) and Event context(CRUD events) management.
4. Public screens in src/screens/Public have the screens for the landing page (where biometric auth or manual login happens)
   and the registration page.
5. Private screens in src/screens/Private have the Events(Calendar) and Profile pages.
6. src/services has the firebase functions for auth and firestore data saving, notification management and other constants
7. src/helper and src/hooks have some reusable functions
8. src/components has the shared components between the pages.

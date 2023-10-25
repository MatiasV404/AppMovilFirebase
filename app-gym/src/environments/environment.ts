// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Integramos firebase con SDK
  firebaseConfig: {
    apiKey: "AIzaSyCLAvS2SITi7eTHayBf4Eof-NsvhJpuV6k",
    authDomain: "fitplan-app-c0db0.firebaseapp.com",
    projectId: "fitplan-app-c0db0",
    storageBucket: "fitplan-app-c0db0.appspot.com",
    messagingSenderId: "488817344435",
    appId: "1:488817344435:web:fcbcc1ed56729470b155c6"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

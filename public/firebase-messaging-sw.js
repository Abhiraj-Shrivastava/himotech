// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBC7_FpsKiOJghwIG0ZTLp_Hq6noyipvwE",
    authDomain: "agrisarathi-64d6e.firebaseapp.com",
    projectId: "agrisarathi-64d6e",
    storageBucket: "agrisarathi-64d6e.appspot.com",
    messagingSenderId: "86902628258",
    appId: "1:86902628258:web:943ea6b615e33326d99cfb",
    measurementId: "G-ZPGQKC678Q"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image,
      sound: 'default'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
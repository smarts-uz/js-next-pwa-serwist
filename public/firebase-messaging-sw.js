importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
const firebaseConfig = {
  apiKey: "AIzaSyAGn5FGNu5vV8yTc_sMgp61wK86gtQXRTc",
  authDomain: "smarts-next-pwa.firebaseapp.co",
  projectId: "smarts-next-pwa",
  storageBucket: "smarts-next-pwa.firebasestorage.app",
  messagingSenderId: "545017091933",
  appId: "1:545017091933:web:6ec64e6cf90f7853e7bab4",
  measurementId: "G-NNJ214WV5M",
};
// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Optional: Add event listener for 'push' events
self.addEventListener('push', function (event) {
  if (event.data) {
    const notificationData = event.data.json();
    const notificationTitle = notificationData.notification.title;
    const notificationOptions = {
      body: notificationData.notification.body,
      icon: notificationData.notification.icon
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

// Optional: Add event listener for 'notificationclick' events
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  // Add logic for handling notification clicks
});
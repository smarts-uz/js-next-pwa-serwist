
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});


// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Optional: Add event listener for 'push' events
self.addEventListener('push', function (event) {
  if (event.data) {
    console.log(event)
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
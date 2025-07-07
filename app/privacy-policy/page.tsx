import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Next.js PWA application.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="space-y-8 text-foreground/90">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to Next.js PWA ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we handle your personal information when you use our Progressive Web App (PWA).
          </p>
          <p className="mt-2">
            This application is designed as a demonstration of PWA capabilities. It operates entirely on your device (client-side). We do not have a backend server, and we do not collect, store, or transmit your personal data to any server.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Information We Access (with Your Permission)</h2>
          <p>
            Our PWA may request access to certain device features and data to provide its full functionality. Access is only granted with your explicit permission through your web browser's consent prompts. Here is a breakdown of the features and why we need access:
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4">
            <li>
              <strong>Geolocation:</strong> To demonstrate location-based features, we may request access to your device's location. Your location is used only within the app to display your position or provide location-relevant information and is not stored or shared.
            </li>
            <li>
              <strong>Media Capture (Camera):</strong> For features involving media capture, we may request access to your device's camera. Any images or videos you capture are processed locally on your device and are not uploaded to our servers.
            </li>
            <li>
              <strong>Web Bluetooth:</strong> To interact with nearby Bluetooth devices, we request your permission to access Web Bluetooth APIs. All communication with Bluetooth devices is handled locally on your device.
            </li>
            <li>
              <strong>Speech Recognition & Synthesis:</strong> The app may request microphone access for speech-to-text functionality and use your device's text-to-speech capabilities. Audio data is processed in real-time and is not stored.
            </li>
            <li>
              <strong>File Handling:</strong> The app allows you to open and edit files (e.g., `.txt`, `.md`). We only access files that you explicitly select. All file processing happens on your device, and we do not upload your files.
            </li>
            <li>
              <strong>Web Authentication (Biometrics):</strong> For secure authentication, we may use the Web Authentication API, which can interface with your device's biometric sensors (e.g., fingerprint or face ID). Your biometric data is never accessed by our app; it is securely managed by your browser and operating system, which only inform us of the authentication success or failure.
            </li>
            <li>
              <strong>Payment Request API:</strong> To facilitate payments, we use the browser's Payment Request API. This API securely provides your payment details to payment handlers of your choice. We do not receive, process, or store your credit card numbers or other payment information.
            </li>
            <li>
              <strong>Network Information:</strong> The app can access information about your network connection (e.g., online/offline status, connection type) to provide a better user experience, such as enabling offline functionality.
            </li>
             <li>
              <strong>Screen Wake Lock:</strong> To prevent the screen from dimming or locking during certain activities (like reading or presenting), the app may request a screen wake lock. This does not involve collecting any personal data.
            </li>
            <li>
              <strong>Push Notifications:</strong> With your permission, we may send you push notifications. We store a unique, anonymous identifier on your device to send these notifications. You can manage this permission in your browser settings.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p>
            Any data accessed by the app is used exclusively to enable the features you choose to interact with. All data processing is performed locally on your device. We do not use your data for advertising, tracking, or any other purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Storage and Security</h2>
          <p>
            Our PWA uses your browser's local storage (e.g., Local Storage, IndexedDB) to save application settings or data you create within the app. This data is stored on your device and is not accessible to us. We rely on the security measures provided by your web browser and operating system to protect this data. All network communication for the app itself is secured via HTTPS.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Information Sharing and Disclosure</h2>
          <p>
            We do not share any of your personal data with third parties because we do not collect it. Features like the Web Share API allow you to share content with other apps, but you control this process, and we do not track what you share or with whom.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights and Choices</h2>
          <p>
            You have full control over the permissions you grant to our PWA. You can review and revoke permissions at any time through your web browser's settings for this site. You can also clear any data stored locally by the app by clearing your browser's cache and site data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Children's Privacy</h2>
          <p>
            Our service is not intended for individuals under the age of 13. We do not knowingly collect any personal data. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us so that we can take necessary action.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: [Your Email Address]
          </p>
        </section>
      </div>
    </main>
  );
}

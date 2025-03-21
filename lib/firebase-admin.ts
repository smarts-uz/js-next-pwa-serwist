import { initializeApp, cert, type ServiceAccount, getApps } from "firebase-admin/app";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
) as ServiceAccount;

function initializeFirebaseAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

export { initializeFirebaseAdmin };

import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
) as ServiceAccount;

if (!initializeApp.length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export default initializeApp;

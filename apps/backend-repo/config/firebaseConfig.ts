// @ts-ignore
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

// init firebase admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export const db = admin.firestore();
export default admin;

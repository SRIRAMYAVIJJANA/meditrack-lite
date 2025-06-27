const admin = require('firebase-admin');

// Optional: Load .env locally if needed
require('dotenv').config();

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (err) {
  console.error("🔥 Error initializing Firebase Admin SDK:", err.message);
  console.error("🛑 Check if FIREBASE_CONFIG is set correctly and properly escaped.");
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };

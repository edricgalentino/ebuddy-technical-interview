import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

/**
 * Firebase Cloud Function that runs every 15 minutes to clean up stale presence data
 * This function:
 * 1. Finds users who are marked 'online' but haven't updated their status in 15 minutes
 * 2. Updates their status to 'offline'
 */
export const cleanupStalePresence = onSchedule(
  {
    schedule: "every 15 minutes",
    timeZone: "UTC",
    retryCount: 3,
  },
  async (event) => {
    try {
      const firestore = admin.firestore();

      // Calculate the stale threshold (15 minutes ago)
      const staleThreshold = Date.now() - 15 * 60 * 1000;

      // Query for status documents where the user is online but hasn't been active recently
      const staleStatusQuery = await firestore
        .collection("status")
        .where("state", "==", "online")
        .where("lastChanged", "<", admin.firestore.Timestamp.fromMillis(staleThreshold))
        .get();

      if (staleStatusQuery.empty) {
        console.log("No stale presence records found");
        return;
      }

      // Create a batch to update all documents at once
      const batch = firestore.batch();
      const staleUserIds: string[] = [];

      staleStatusQuery.forEach((doc) => {
        const userId = doc.id;
        staleUserIds.push(userId);

        // Mark status as offline
        batch.update(doc.ref, {
          state: "offline",
          lastChanged: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Also update the user document
        const userRef = firestore.collection("users").doc(userId);
        batch.update(userRef, {
          status: "offline",
          updatedAt: new Date().toISOString(),
        });
      });

      // Commit the batch
      await batch.commit();

      console.log(`Updated ${staleUserIds.length} stale presence records to offline`);
      return;
    } catch (error) {
      console.error("Error cleaning up stale presence:", error);
      return;
    }
  }
);

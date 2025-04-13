import { useEffect, useRef } from "react";
import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { updateUserData } from "../store/userSlice";
import { AppDispatch } from "../store/store";

/**
 * Hook to manage user presence (online/offline status):
 * 1. update user's online status when they connect
 * 2. update user's offline status when they disconnect
 * 3. update the recentlyActive timestamp periodically (every minute)
 * 4. listen to browser events for better accuracy
 */
export function usePresence() {
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const userStatusRef = doc(db, "status", uid);

    const isOffline = {
      state: "offline",
      lastChanged: serverTimestamp(),
    };
    const isOnline = {
      state: "online",
      lastChanged: serverTimestamp(),
    };

    const updateRecentlyActive = async () => {
      try {
        await dispatch(
          updateUserData({
            id: uid,
            data: {
              recentlyActive: Date.now(),
            },
          })
        );
      } catch (error) {
        console.error("Error updating recentlyActive:", error);
      }
    };

    const startHeartbeat1m = () => {
      // clear existing interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      // update recentlyActive every minute
      heartbeatIntervalRef.current = setInterval(updateRecentlyActive, 60000);
    };

    const setupPresence = async () => {
      try {
        // update status document to show user is online
        await setDoc(userStatusRef, isOnline);

        await updateRecentlyActive();

        startHeartbeat1m();
      } catch (error) {
        console.error("Error setting up presence:", error);
      }
    };

    const connectedRef = doc(db, ".info/connected");

    const unsubscribe = onSnapshot(connectedRef, (snapshot) => {
      if (snapshot.exists()) {
        setupPresence();
      }
    });

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        await setDoc(userStatusRef, isOnline);
        await updateRecentlyActive();
        startHeartbeat1m();
      } else {
        await setDoc(userStatusRef, {
          state: "away",
          lastChanged: serverTimestamp(),
        });

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
      }
    };

    // Handle when the user is about to leave the page
    const handleBeforeUnload = async () => {
      try {
        await setDoc(userStatusRef, isOffline);

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
      } catch (error) {
        console.error("Error in beforeunload handler:", error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // initial load setup
    setupPresence();

    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      // set user offline when cleaning up
      setDoc(userStatusRef, isOffline).catch((err) => {
        console.error("Error setting offline status on cleanup:", err);
      });
    };
  }, [dispatch]);
}

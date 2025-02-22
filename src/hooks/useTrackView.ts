import { useEffect, useRef } from "react";

export const useTrackView = (postId: number) => {
  const timeSpentRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const isTrackingRef = useRef<boolean>(false);

  const trackView = async () => {
    // Prevent concurrent tracking requests
    if (isTrackingRef.current) return;

    try {
      isTrackingRef.current = true;
      const now = Date.now();
      timeSpentRef.current = Math.round((now - startTimeRef.current) / 1000);

      const response = await fetch("/api/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          time_spent: timeSpentRef.current,
          timestamp: now,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track view");
      }
    } catch (error) {
      console.error("Error tracking view:", error);
    } finally {
      isTrackingRef.current = false;
    }
  };

  useEffect(() => {
    // Track initial view with a slight delay to prevent duplicate entries
    const initialTrackTimeout = setTimeout(() => trackView(), 1000);

    // Track on page hide/unmount
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackView();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(initialTrackTimeout);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      trackView();
    };
  }, []);
};

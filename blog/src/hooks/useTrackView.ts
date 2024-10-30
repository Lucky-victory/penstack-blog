import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react"; // If using NextAuth.js

export const useTrackView = (postId: number) => {
  const { data: session } = useSession();
  const scrollRef = useRef<number>(0);
  const timeSpentRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );
      scrollRef.current = Math.max(scrollRef.current, scrollPercentage);
    };

    const trackView = async () => {
      try {
        const response = await fetch("/api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            userId: session?.user?.id,
            timeSpent: timeSpentRef.current,
            scrollDepth: scrollRef.current,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to track view");
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    // Track initial view
    trackView();

    // Set up scroll tracking
    window.addEventListener("scroll", trackScroll);

    // Set up time tracking
    intervalId = setInterval(() => {
      timeSpentRef.current = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );
    }, 1000);

    // Update on unmount or when leaving the page
    const handleBeforeUnload = () => {
      trackView();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", trackScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(intervalId);
      trackView();
    };
  }, [postId, session]);
};

import { useTrackView } from "@/src/hooks/useTrackView";

export const ViewTracker = ({ postId }: { postId: number }) => {
  useTrackView(postId);
  return <></>;
};

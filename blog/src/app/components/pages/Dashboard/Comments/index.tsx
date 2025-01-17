import { Box, useToast } from "@chakra-ui/react";
import { PageTitleCard } from "../../../Dashboard/PageTitleCard";

export const CommentsDashboard = () => {
  //   const { data: comments, isLoading } = useGetCommentsQuery();
  //   const [deleteComment] = useDeleteCommentMutation();
  const toast = useToast();

  const handleDeleteComment = async (commentId: number) => {
    try {
      //   await deleteComment(commentId);
      toast({
        title: "Comment deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting comment",
        description: "An error occurred while deleting the comment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <PageTitleCard title={"Comments"}></PageTitleCard>
      {/* <CommentList comments={comments} onDelete={handleDeleteComment} /> */}
    </Box>
  );
};

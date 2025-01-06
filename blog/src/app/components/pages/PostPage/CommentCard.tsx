import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  IconButton,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { LuHeart, LuMessageCircle, LuFlag } from "react-icons/lu";
import { formatDate } from "@/src/utils";

interface CommentCardProps {
  comment: any; // Replace with proper comment type
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
    >
      <HStack spacing={4} align="start">
        <Avatar
          size="md"
          src={comment.author?.avatar}
          name={comment.author?.name}
        />
        <VStack align="start" flex={1} spacing={2}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{comment.author?.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {formatDate(new Date(comment.created_at))}
              </Text>
            </VStack>
            <IconButton
              icon={<LuFlag />}
              aria-label="Report comment"
              variant="ghost"
              size="sm"
            />
          </HStack>

          <Text>{comment.content}</Text>

          <HStack spacing={4}>
            <Button leftIcon={<LuHeart />} size="sm" variant="ghost">
              Like
            </Button>
            <Button leftIcon={<LuMessageCircle />} size="sm" variant="ghost">
              Reply
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

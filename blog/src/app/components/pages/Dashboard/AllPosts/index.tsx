"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Card,
  CardBody,
  Stack,
  Text,
  Button,
  HStack,
  Badge,
  InputGroup,
  InputLeftAddon,
  Input,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  AddIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { LuGlobe2, LuLock } from "react-icons/lu";
import { format } from "date-fns";
import { Link } from "@chakra-ui/next-js";
import { PermissionGuard } from "../../../PermissionGuard";
import { usePosts } from "@/src/hooks";
import { useAuth } from "@/src/hooks/useAuth";
import { PostSelect } from "@/src/types";
import { formatPostPermalink } from "@/src/utils";
import DashHeader from "../../../Dashboard/Header";
import Loader from "../../../Loader";

const PostsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState<PostSelect | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostSelect[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { posts, loading, refetchPosts } = usePosts({
    status: "all",
    limit: 20,
    access: "dashboard",
  });
  const { user } = useAuth();

  const handleDelete = (post: PostSelect) => {
    setSelectedPost(post);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      await fetch(`/api/posts/${selectedPost?.id}`, {
        method: "DELETE",
      });

      toast({
        title: "Post deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refetchPosts();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error deleting post",
        description: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: PostSelect["status"]) =>
    ({
      published: "green",
      draft: "gray",
      deleted: "red",
    })[status!] || "gray";

  const getVisibilityIcon = (visibility: PostSelect["visibility"]) =>
    visibility === "private" ? <LuLock /> : <LuGlobe2 />;

  useEffect(() => {
    const filtered = posts?.filter((post) => {
      const matchesSearch = (post?.title as string)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    if (filtered && filtered.length > 0) {
      setFilteredPosts([...filtered]);
    }
  }, [posts, searchTerm, statusFilter]);

  return (
    <Box>
      <DashHeader></DashHeader>
      <Box p={{ base: 4, md: 5 }}>
        <Card rounded={"lg"} mb={6}>
          <CardBody px={{ base: 3, lg: 4 }}>
            <HStack justify="space-between" align="center">
              <Heading size="lg">Posts</Heading>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                rounded="md"
                as={Link}
                href="/dashboard/posts/new"
                _hover={{ textDecoration: "none" }}
              >
                New Post
              </Button>
            </HStack>
          </CardBody>
        </Card>

        <Card rounded={"lg"} mb={6}>
          <CardBody px={{ base: 3, lg: 4 }}>
            <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
              <InputGroup maxW={{ md: "320px" }}>
                <InputLeftAddon roundedLeft="md">
                  <SearchIcon />
                </InputLeftAddon>
                <Input
                  rounded="md"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!posts?.length}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                maxW={{ md: "200px" }}
                rounded="md"
                disabled={!posts?.length}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="deleted">Deleted</option>
              </Select>
            </Stack>

            {loading && <Loader loadingText={"Loading posts"} />}

            {filteredPosts && filteredPosts.length > 0 && (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Status</Th>
                    <Th>Author</Th>
                    <Th>Published At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPosts.map((post) => (
                    <Tr key={post.id}>
                      <Td>
                        <Text noOfLines={2}>{post.title}</Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getStatusColor(post.status)}
                          rounded="md"
                          px={2}
                          textTransform="capitalize"
                        >
                          {post.status}
                        </Badge>
                      </Td>
                      <Td>{post.author?.name}</Td>
                      <Td>
                        {post.published_at
                          ? format(
                              new Date(post.published_at),
                              "dd/MM/yyyy hh:mm a"
                            )
                          : "Not published"}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="Preview">
                            <IconButton
                              icon={<ViewIcon />}
                              as={Link}
                              isExternal
                              href={formatPostPermalink(post)}
                              aria-label="Preview"
                              size="sm"
                            />
                          </Tooltip>
                          <PermissionGuard
                            requiredPermission="posts:edit"
                            isOwner={post.author?.auth_id === user?.id}
                          >
                            <Tooltip label="Edit">
                              <IconButton
                                icon={<EditIcon />}
                                as={Link}
                                href={`/dashboard/posts/edit/${post.post_id}`}
                                aria-label="Edit"
                                size="sm"
                              />
                            </Tooltip>
                          </PermissionGuard>
                          <PermissionGuard requiredPermission="posts:delete">
                            <Tooltip label="Delete">
                              <IconButton
                                icon={<DeleteIcon />}
                                aria-label="Delete"
                                size="sm"
                                onClick={() => handleDelete(post)}
                                colorScheme="red"
                              />
                            </Tooltip>
                          </PermissionGuard>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}

            {!loading && !filteredPosts.length && (
              <VStack justify="center" h="200px">
                <Text color="gray.400" fontWeight={500}>
                  No posts yet
                </Text>
              </VStack>
            )}
          </CardBody>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Post</ModalHeader>
            <ModalBody>
              Are you sure you want to delete &quot;{selectedPost?.title}&quot;?
              This action cannot be undone.
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default PostsDashboard;

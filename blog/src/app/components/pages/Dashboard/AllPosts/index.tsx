"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputLeftAddon,
  Spinner,
  HStack,
  Card,
  CardBody,
  VStack,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ChevronDownIcon,
  AddIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { usePosts } from "@/src/hooks";
import { PostSelect } from "@/src/types";
import { useRouter } from "next/navigation";
import { formatPostPermalink } from "@/src/utils";
import Loader from "../../../Loader";

const PostsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState<PostSelect | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostSelect[]>([]);
  const { posts, loading, refetchPosts } = usePosts({
    status: "all",
    limit: 20,
  });
  const router = useRouter();

  const handleEdit = (post: PostSelect) => {
    router.push(`/dashboard/posts/edit/${post.post_id}`);
  };

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

  const getStatusColor = (status: string) => {
    const colors = {
      published: "green",
      draft: "gray",
      deleted: "red",
    };
    return colors[status as keyof typeof colors] || "gray";
  };

  const getVisibilityIcon = (visibility: PostSelect["visibility"]) => {
    return visibility === "private" ? "🔒" : "👁️";
  };

  useEffect(() => {
    const filteredPosts = posts?.filter((post) => {
      const matchesSearch = (post.title as string)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    if (filteredPosts && filteredPosts?.length > 0) {
      setFilteredPosts(() => [...filteredPosts!]);
    }
  }, [posts, searchTerm, statusFilter]);

  return (
    <Box p={8}>
      <Card rounded={{ base: 20, md: 24 }} mb={8}>
        <CardBody>
          <HStack justify="space-between" align="center">
            <Heading size="lg">Posts</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              rounded={"full"}
              onClick={() => (window.location.href = "/dashboard/posts/new")}
            >
              New Post
            </Button>
          </HStack>
        </CardBody>
      </Card>
      <Card rounded={{ base: 20, md: 24 }} mb={8}>
        <CardBody>
          <Stack
            rounded={{ base: 20, md: 24 }}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            mb={6}
          >
            <InputGroup rounded={"full"}>
              <InputLeftAddon roundedLeft={"full"}>
                <SearchIcon />
              </InputLeftAddon>
              <Input
                disabled={!posts?.length}
                rounded={"full"}
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxW={{ md: "320px" }}
              />
            </InputGroup>
            <Select
              value={statusFilter}
              disabled={!posts?.length}
              rounded={"full"}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW={{ md: "300px" }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="deleted">Deleted</option>
            </Select>
          </Stack>
          {loading && (
            <VStack>
              <Loader />
            </VStack>
          )}
          {filteredPosts && filteredPosts.length > 0 && (
            <>
              <Box
                maxH={600}
                overflow="auto"
                bg={"white"}
                p={4}
                rounded={{ base: 20, md: 24 }}
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Status</Th>
                      <Th>Category</Th>
                      <Th>Author</Th>
                      <Th>Published Date</Th>
                      <Th>Views</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredPosts &&
                      filteredPosts.length > 0 &&
                      filteredPosts?.map((post) => (
                        <Tr key={post.id}>
                          <Td>
                            <Flex align="center">
                              {getVisibilityIcon(post.visibility)}
                              <Text ml={2}>{post.title}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Badge
                              rounded={"full"}
                              px={2}
                              colorScheme={getStatusColor(
                                post.status as string
                              )}
                            >
                              {post.status}
                            </Badge>
                          </Td>
                          <Td>{post.category?.name || "-"}</Td>
                          <Td>{post.author?.name}</Td>
                          <Td>
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString()
                              : "-"}
                          </Td>
                          <Td>{post?.views?.count}</Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<ChevronDownIcon />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem
                                  icon={<ViewIcon />}
                                  onClick={() =>
                                    router.push(formatPostPermalink(post))
                                  }
                                >
                                  View
                                </MenuItem>
                                <MenuItem
                                  icon={<EditIcon />}
                                  onClick={() => handleEdit(post)}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  icon={<DeleteIcon />}
                                  onClick={() => handleDelete(post)}
                                  color="red.500"
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>

                {loading && (
                  <HStack my={8} justify={"center"}>
                    <Spinner />
                    <Text>Loading posts...</Text>
                  </HStack>
                )}

                {!loading &&
                  posts?.length === 0 &&
                  filteredPosts?.length === 0 && (
                    <Flex justify="center" my={8}>
                      <Text>No posts found</Text>
                    </Flex>
                  )}
              </Box>
            </>
          )}
          {!loading && !filteredPosts.length && (
            <VStack justify={"center"} h={"200"}>
              <Text color={"gray.400"} fontWeight={500}>
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
  );
};

export default PostsDashboard;

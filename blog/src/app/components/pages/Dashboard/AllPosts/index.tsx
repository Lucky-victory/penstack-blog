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

const PostsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState<PostSelect | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostSelect[]>([]);
  const { posts, loading } = usePosts();
  const router = useRouter();
  // Simulated fetch posts function
  const fetchPosts = async () => {
    try {
      // Replace with actual API call
      const response = await fetch("/api/posts");
      const data = await response.json();
      //   setPosts(data.posts);
      //   setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error fetching posts",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      //   setLoading(false);
    }
  };

  const handleEdit = (post: PostSelect) => {
    // Implement edit navigation
    router.push(`/dashboard/posts/edit/${post.post_id}`);
  };

  const handleDelete = (post: PostSelect) => {
    setSelectedPost(post);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      // Replace with actual API call
      await fetch(`/api/posts/${selectedPost?.id}`, {
        method: "DELETE",
      });

      toast({
        title: "Post deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchPosts();
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
    setFilteredPosts(filteredPosts);
  }, [posts, searchTerm, statusFilter]);

  return (
    <Box p={8}>
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        bg={"white"}
        p={4}
        rounded={"md"}
      >
        <Heading size="lg">Posts</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => (window.location.href = "/dashboard/posts/new")}
        >
          New Post
        </Button>
      </Flex>

      <Stack
        bg={"white"}
        p={4}
        rounded={"md"}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        mb={6}
      >
        <InputGroup>
          <InputLeftAddon>
            <SearchIcon />
          </InputLeftAddon>
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW={{ md: "320px" }}
          />
        </InputGroup>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW={{ md: "300px" }}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="deleted">Deleted</option>
        </Select>
      </Stack>

      <Box overflowX="auto" bg={"white"} p={4} rounded={"md"}>
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
            {posts &&
              filteredPosts?.map((post) => (
                <Tr key={post.id}>
                  <Td>
                    <Flex align="center">
                      {getVisibilityIcon(post.visibility)}
                      <Text ml={2}>{post.title}</Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(post.status as string)}>
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
                  <Td>{post.views}</Td>
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
                          onClick={() => router.push(formatPostPermalink(post))}
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
          <Flex justify="center" my={8}>
            <Spinner />
            <Text>Loading posts...</Text>
          </Flex>
        )}

        {!loading && filteredPosts.length === 0 && (
          <Flex justify="center" my={8}>
            <Text>No posts found</Text>
          </Flex>
        )}
      </Box>

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

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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  AddIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { LuGlobe2, LuLock } from "react-icons/lu";
import { format } from "date-fns";
import { Link } from "@chakra-ui/next-js";
import { PermissionGuard } from "../../../PermissionGuard";
import { useAuth } from "@/src/hooks/useAuth";
import { PostSelect } from "@/src/types";
import { formatPostPermalink, objectToQueryParams } from "@/src/utils";
import DashHeader from "../../../Dashboard/Header";
import Loader from "../../../Loader";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../../Pagination";
import { PageTitleCard } from "../../../Dashboard/PageTitleCard";

const PostsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [posts, setPosts] = useState<PostSelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPost, setSelectedPost] = useState<PostSelect | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url;
      if (searchTerm) {
        url = `/api/posts/search?
        ${objectToQueryParams({
          q: searchTerm,
          page,
          limit,
          status: statusFilter,
          access: "dashboard",
          sortBy,
          sortOrder,
        })}`;
      } else {
        url = `/api/posts?
        ${objectToQueryParams({
          page,
          limit,
          status: statusFilter,
          sortBy,
          sortOrder,
          access: "dashboard",
        })}`;
      }

      const { data } = await axios(url);
      setPosts(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      toast({
        title: "Error fetching posts",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const { refetch } = useQuery({
    queryKey: ["posts", page, statusFilter, sortBy, sortOrder],
    queryFn: fetchPosts,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        setPage(1);
        refetch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, refetch]);

  const handleDelete = (post: PostSelect) => {
    setSelectedPost(post);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/posts/${selectedPost?.id}`);

      toast({
        title: "Post deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refetch();
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

  return (
    <Box>
      <DashHeader></DashHeader>
      <Box p={{ base: 4, md: 5 }}>
        <PageTitleCard title={"Posts"}>
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
        </PageTitleCard>

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
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                maxW={{ md: "200px" }}
                rounded="md"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="deleted">Deleted</option>
              </Select>
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                maxW={{ md: "200px" }}
                rounded="md"
              >
                <option value="recent">Recent</option>
                <option value="published_at">Published Date</option>
                <option value="popular">Popular</option>
              </Select>
              <Select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                maxW={{ md: "150px" }}
                rounded="md"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </Stack>

            {loading && <Loader loadingText={"Loading posts"} />}

            {posts && posts.length > 0 && (
              <>
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
                    {posts.map((post) => (
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
                                variant="ghost"
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
                                  variant="ghost"
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
                                  variant="ghost"
                                />
                              </Tooltip>
                            </PermissionGuard>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Box mx={"auto"} pt={5}>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                    }}
                  />
                </Box>
              </>
            )}

            {!loading && !posts.length && (
              <VStack justify="center" h="200px">
                <Text color="gray.400" fontWeight={500}>
                  No posts found
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
              Are you sure you want to delete &apos;{selectedPost?.title}&apos;?
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

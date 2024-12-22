"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Heading,
  Card,
  CardBody,
  Image,
  Stack,
  Text,
  Button,
  HStack,
  Badge,
  InputGroup,
  InputLeftAddon,
  Input,
  Select,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Tooltip,
  useColorMode,
  useColorModeValue,
  Flex,
  CardFooter,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ChevronDownIcon,
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
import { formatPostPermalink, objectToQueryParams } from "@/src/utils";

const PostsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState<PostSelect | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostSelect[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const postCardBg = useColorModeValue("white", "black");
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
    <Box p={4}>
      <Card rounded={{ base: 20, md: 24 }} mb={8}>
        <CardBody>
          <HStack justify="space-between" align="center">
            <Heading size="lg">Posts</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              rounded="full"
              as={Link}
              href="/dashboard/posts/new"
              _hover={{ textDecoration: "none" }}
            >
              New Post
            </Button>
          </HStack>
        </CardBody>
      </Card>

      <Card rounded={{ base: 20, md: 24 }} mb={8}>
        <CardBody>
          <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
            <InputGroup maxW={{ md: "320px" }}>
              <InputLeftAddon roundedLeft="full">
                <SearchIcon />
              </InputLeftAddon>
              <Input
                rounded="full"
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
              rounded="full"
              disabled={!posts?.length}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="deleted">Deleted</option>
            </Select>
          </Stack>

          {loading && (
            <VStack py={8}>
              <Spinner />
              <Text>Loading posts...</Text>
            </VStack>
          )}

          {filteredPosts && filteredPosts.length > 0 && (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                // lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  rounded="xl"
                  overflow="hidden"
                  transition="all 0.2s"
                  bg={postCardBg}
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                >
                  <CardBody p={0} h={200}>
                    <Flex gap={4} h="160">
                      <Image
                        src={
                          post.featured_image?.url ||
                          `/api/og?${objectToQueryParams({
                            title: post.title,
                            date: post?.published_at
                              ? post?.published_at
                              : post?.created_at,
                            username: post?.author?.username,
                            avatar: post?.author?.avatar,
                            name: post?.author?.name,
                            category: post?.category?.name,
                          })}`
                        }
                        alt={post.title || ""}
                        h={"full"}
                        w={"150px"}
                        objectFit="cover"
                      />
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Badge
                            colorScheme={getStatusColor(post.status)}
                            rounded="full"
                            px={2}
                            textTransform="capitalize"
                          >
                            {post.status}
                          </Badge>
                          {getVisibilityIcon(post.visibility)}
                        </HStack>

                        <Tooltip label={post.title} hasArrow>
                          <Heading size="md" noOfLines={2}>
                            {post.title}
                          </Heading>
                        </Tooltip>

                        <HStack fontSize="sm" color="gray.500" spacing={2}>
                          <Text>{post.author?.name}</Text>
                          <Text>•</Text>
                          <Text>
                            {post.published_at
                              ? format(
                                  new Date(post.published_at),
                                  "dd/MM/yyyy hh:mm a"
                                )
                              : "Not published"}
                          </Text>
                        </HStack>

                        {post.category?.name && (
                          <Text fontSize="sm" color="gray.600">
                            {post.category.name}
                          </Text>
                        )}

                        <Text fontSize="sm" color="gray.500">
                          Created:{" "}
                          {format(
                            new Date(post.created_at as Date),
                            "dd/MM/yyyy hh:mm a"
                          )}
                        </Text>
                      </VStack>
                    </Flex>
                    <CardFooter>
                      <HStack justify="space-between" pt={2}>
                        <Text fontSize="sm" color="gray.500">
                          {post.views?.count || 0} views
                        </Text>

                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            variant="ghost"
                            size="sm"
                            rounded="full"
                          >
                            Actions
                          </MenuButton>
                          <MenuList rounded="xl" px={1}>
                            <MenuItem
                              rounded="full"
                              icon={<ViewIcon />}
                              as={Link}
                              isExternal
                              href={formatPostPermalink(post)}
                            >
                              View
                            </MenuItem>
                            <PermissionGuard
                              requiredPermission="posts:edit"
                              isOwner={post.author?.auth_id === user?.id}
                            >
                              <MenuItem
                                icon={<EditIcon />}
                                as={Link}
                                rounded="full"
                                href={`/dashboard/posts/edit/${post.post_id}`}
                              >
                                Edit
                              </MenuItem>
                            </PermissionGuard>
                            <PermissionGuard requiredPermission="posts:delete">
                              <MenuItem
                                rounded="full"
                                icon={<DeleteIcon />}
                                onClick={() => handleDelete(post)}
                                color="red.500"
                              >
                                Delete
                              </MenuItem>
                            </PermissionGuard>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </CardFooter>
                  </CardBody>
                </Card>
              ))}
            </Grid>
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
  );
};

export default PostsDashboard;

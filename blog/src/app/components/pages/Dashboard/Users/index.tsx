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
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  VStack,
  HStack,
  Card,
  CardBody,
  Avatar,
  TableContainer,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  AddIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";

// Mock data and types (replace with actual types from your schema)
interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role_id: number;
  auth_type: "local" | "google" | "github" | "facebook";
  avatar?: string;
  created_at: Date;
}

const UsersDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch users (mock implementation)
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        role_id: 1,
        auth_type: "local",
        avatar: "https://bit.ly/dan-abramov",
        created_at: new Date(),
      },
      {
        id: 2,
        name: "Mike Lily",
        email: "lily@example.com",
        username: "johndoe",
        role_id: 2,
        auth_type: "local",
        avatar: "https://bit.ly/dan-abramov",
        created_at: new Date(),
      },
      // Add more mock users...
    ];
    setUsers(mockUsers);
  }, []);

  // Filter users
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "all" || user.role_id.toString() === roleFilter;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  // Handle user selection
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user.id)
    );
  };

  // Open modal for create/edit
  const openUserModal = (user?: User) => {
    setCurrentUser(user || {});
    onOpen();
  };

  // Save user
  const saveUser = () => {
    // Implement save logic
    toast({
      title: currentUser?.id ? "User Updated" : "User Created",
      status: "success",
      duration: 3000,
    });
    onClose();
  };

  // Bulk actions
  const performBulkAction = (action: string) => {
    // Implement bulk action logic
    toast({
      title: `Performed ${action} on ${selectedUsers.length} users`,
      status: "info",
      duration: 3000,
    });
    setSelectedUsers([]);
  };

  return (
    <Box p={8}>
      <Card rounded={{ base: 20, md: 24 }} mb={8}>
        <CardBody>
          <HStack justify="space-between" align="center">
            <Heading size="lg">Users Management</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              rounded="full"
              onClick={() => openUserModal()}
            >
              Add User
            </Button>
          </HStack>
        </CardBody>
      </Card>

      <Card rounded={{ base: 20, md: 24 }} mb={8}>
        <CardBody>
          <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
            <InputGroup>
              <InputLeftAddon>
                <SearchIcon />
              </InputLeftAddon>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select
              placeholder="Filter by Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="1">Admin</option>
              <option value="2">Editor</option>
              <option value="3">User</option>
            </Select>
          </Stack>

          {selectedUsers.length > 0 && (
            <HStack mb={4}>
              <Text>{selectedUsers.length} users selected</Text>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size="sm"
                >
                  Bulk Actions
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => performBulkAction("delete")}>
                    Delete Selected
                  </MenuItem>
                  <MenuItem onClick={() => performBulkAction("activate")}>
                    Activate
                  </MenuItem>
                  <MenuItem onClick={() => performBulkAction("deactivate")}>
                    Deactivate
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          )}
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={selectedUsers.length === filteredUsers.length}
                      onChange={selectAllUsers}
                    />
                  </Th>
                  <Th>User</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Auth Type</Th>
                  <Th>Created At</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <Checkbox
                        isChecked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                    </Td>
                    <Td>
                      <Flex align="center">
                        <Avatar
                          size="sm"
                          name={user.name}
                          src={user.avatar}
                          mr={3}
                        />
                        <Text>{user.name}</Text>
                      </Flex>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          user.role_id === 1
                            ? "red"
                            : user.role_id === 2
                            ? "blue"
                            : "green"
                        }
                      >
                        {user.role_id === 1
                          ? "Admin"
                          : user.role_id === 2
                          ? "Editor"
                          : "User"}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge variant="outline" colorScheme="purple">
                        {user.auth_type}
                      </Badge>
                    </Td>
                    <Td>{new Date(user.created_at).toLocaleDateString()}</Td>
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
                            icon={<EditIcon />}
                            onClick={() => openUserModal(user)}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem icon={<DeleteIcon />} color="red.500">
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      {/* User Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentUser?.id ? "Edit User" : "Add New User"}
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Enter full name"
                  value={currentUser?.name || ""}
                  onChange={(e) =>
                    setCurrentUser((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="Enter email"
                  type="email"
                  value={currentUser?.email || ""}
                  onChange={(e) =>
                    setCurrentUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={currentUser?.role_id || ""}
                  onChange={(e) =>
                    setCurrentUser((prev) => ({
                      ...prev,
                      role_id: parseInt(e.target.value),
                    }))
                  }
                >
                  <option value="1">Admin</option>
                  <option value="2">Editor</option>
                  <option value="3">User</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={saveUser}>
              {currentUser?.id ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UsersDashboard;

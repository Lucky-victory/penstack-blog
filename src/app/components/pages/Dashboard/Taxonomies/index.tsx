"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  Box,
  Flex,
  Text,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";
import {
  LuTag,
  LuFolderTree,
  LuSearch,
  LuPlus,
  LuMoreVertical,
  LuArrowUpDown,
  LuTrash2,
  LuFileEdit,
} from "react-icons/lu";
import { PageTitleHeader } from "@/src/app/components/Dashboard/PageTitleCard";
import DashHeader from "@/src/app/components/Dashboard/Header";
import Pagination from "../../../Pagination";
import { parseAsStringLiteral, useQueryState } from "nuqs";

interface TaxonomyItem {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

interface TaxonomyData {
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
}

interface SortConfig {
  key: keyof TaxonomyItem;
  direction: "asc" | "desc";
}

interface FilteredListProps {
  items: TaxonomyItem[];
  type: "categories" | "tags";
}

const DashboardTaxonomyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const tabsOptions = ["categories", "tags"] as const;
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringLiteral(tabsOptions).withDefault("categories")
  );

  const [newItemDialog, setNewItemDialog] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<TaxonomyItem | null>(null);

  const taxonomyData: TaxonomyData = {
    categories: [
      { id: 1, name: "Technology", slug: "technology", postCount: 15 },
      { id: 2, name: "Tutorials", slug: "tutorials", postCount: 8 },
      { id: 3, name: "News", slug: "news", postCount: 12 },
    ],
    tags: [
      { id: 1, name: "React", slug: "react", postCount: 12 },
      { id: 2, name: "JavaScript", slug: "javascript", postCount: 20 },
      { id: 3, name: "TypeScript", slug: "typescript", postCount: 8 },
      { id: 4, name: "React", slug: "react", postCount: 12 },
      { id: 5, name: "JavaScript", slug: "javascript", postCount: 20 },
      { id: 6, name: "TypeScript", slug: "typescript", postCount: 8 },
    ],
  };

  const ITEMS_PER_PAGE = 5;

  const handleSort = (key: keyof TaxonomyItem): void => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id: number): void => {
    console.log("Delete item:", id);
  };

  const handleEdit = (item: TaxonomyItem): void => {
    setEditItem(item);
    setNewItemDialog(true);
  };

  const handleSave = (formData: { name: string }): void => {
    console.log("Save item:", formData);
    setNewItemDialog(false);
    setEditItem(null);
  };

  const FilteredList: React.FC<FilteredListProps> = ({ items, type }) => {
    const filteredItems = items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const direction = sortConfig.direction === "asc" ? 1 : -1;
        return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
      });

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    const headerBg = useColorModeValue("gray.50", "gray.700");
    const cellBg = useColorModeValue("white", "gray.800");
    const cellTextColor = useColorModeValue("gray.800", "gray.200");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    return (
      <Flex gap={4} overflowX={"auto"}>
        <Box flexShrink={0} flexGrow={1} mb={3}>
          <Grid
            templateColumns="repeat(12, 1fr)"
            alignItems={"center"}
            gap={4}
            px={4}
            py={2}
            mb={3}
            bg={headerBg}
            borderRadius="lg"
            fontWeight="medium"
            fontSize="sm"
          >
            <GridItem colSpan={1} />
            <GridItem colSpan={3}>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                ml={-3}
                size="sm"
                rightIcon={<LuArrowUpDown />}
              >
                Name
              </Button>
            </GridItem>
            <GridItem colSpan={4}>Slug</GridItem>
            <GridItem colSpan={2}>
              <Button
                variant="ghost"
                onClick={() => handleSort("postCount")}
                size="sm"
                ml={-3}
                rightIcon={<LuArrowUpDown />}
              >
                Posts Count
              </Button>
            </GridItem>
            <GridItem colSpan={2}>Actions</GridItem>
          </Grid>

          <Box>
            {paginatedItems.map((item) => (
              <Grid
                key={item.id}
                templateColumns="repeat(12, 1fr)"
                gap={4}
                px={4}
                py={3}
                bg={cellBg}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                alignItems="center"
                _hover={{ bg: headerBg }}
              >
                <GridItem colSpan={1}>
                  {type === "categories" ? <LuFolderTree /> : <LuTag />}
                </GridItem>
                <GridItem colSpan={3} fontWeight="medium">
                  {item.name}
                </GridItem>
                <GridItem colSpan={4} color={cellTextColor}>
                  {item.slug}
                </GridItem>
                <GridItem colSpan={2}>
                  <Badge>{item.postCount}</Badge>
                </GridItem>
                <GridItem colSpan={2}>
                  <Menu>
                    <MenuButton as={Button} variant="ghost" size="sm">
                      <LuMoreVertical />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        icon={<LuFileEdit />}
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        color="red.600"
                        icon={<LuTrash2 />}
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </GridItem>
              </Grid>
            ))}
          </Box>

          <HStack py={4} justify={"center"}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </HStack>
        </Box>
      </Flex>
    );
  };

  const AddEditForm: React.FC = () => (
    <Modal isOpen={newItemDialog} onClose={() => setNewItemDialog(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editItem ? "Edit" : "Add New"}{" "}
          {activeTab === "categories" ? "Category" : "Tag"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Enter the details below. The slug will be auto-generated.
          </Text>
          <Input placeholder="Name" defaultValue={editItem?.name || ""} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleSave({ name: "Example" })}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Box>
      <DashHeader />
      <Box p={4}>
        <Card>
          <PageTitleHeader title="Taxonomies">
            <Button
              onClick={() => setNewItemDialog(true)}
              leftIcon={<LuPlus />}
            >
              Add New
            </Button>
          </PageTitleHeader>

          <CardBody>
            <Tabs
              //   value={selectedType}
              defaultIndex={activeTab === "categories" ? 0 : 1}
              onChange={(index) =>
                setActiveTab(index === 0 ? "categories" : "tags")
              }
            >
              <TabList>
                <Tab>Categories</Tab>
                <Tab>Tags</Tab>
              </TabList>

              <Box my={4}>
                <Flex align="center" gap={4}>
                  <Box position="relative" flex={1}>
                    <InputGroup>
                      <InputLeftElement>
                        <LuSearch />
                      </InputLeftElement>
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        pl={8}
                        maxW={"300px"}
                      />
                    </InputGroup>
                  </Box>
                </Flex>
              </Box>

              <TabPanels>
                <TabPanel>
                  <FilteredList
                    items={taxonomyData.categories}
                    type="categories"
                  />
                </TabPanel>
                <TabPanel>
                  <FilteredList items={taxonomyData.tags} type="tags" />
                </TabPanel>
              </TabPanels>
            </Tabs>

            <AddEditForm />
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardTaxonomyPage;

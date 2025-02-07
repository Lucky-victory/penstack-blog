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
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { LuSearch, LuPlus } from "react-icons/lu";
import { PageTitleHeader } from "@/src/app/components/Dashboard/PageTitleCard";
import DashHeader from "@/src/app/components/Dashboard/Header";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { TaxonomyItem } from "@/src/types";
import { useTaxonomiesStore } from "./state";
import { CategoriesPanel } from "./CategoriesPanel";
import { TagsPanel } from "./TagsPanel";

const DashboardTaxonomyPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setType = useTaxonomiesStore((state) => state.setType);
  const searchTerm = useTaxonomiesStore((state) => state.searchTerm);
  const setSearchTerm = useTaxonomiesStore((state) => state.setSearchTerm);

  const tabsOptions = ["categories", "tags"] as const;
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringLiteral(tabsOptions).withDefault("categories")
  );

  const [newItemDialog, setNewItemDialog] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<TaxonomyItem | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSave = (formData: { name: string }): void => {
    console.log("Save item:", formData);
    setNewItemDialog(false);
    setEditItem(null);
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
      <Box p={{ base: 4, md: 5 }}>
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
              isLazy
              defaultIndex={activeTab === "categories" ? 0 : 1}
              onChange={(index) => {
                setActiveTab(index === 0 ? "categories" : "tags");
                setType(index === 0 ? "categories" : "tags");
                setSearchTerm("");
              }}
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
                        // pl={8}
                        maxW={"300px"}
                      />
                    </InputGroup>
                  </Box>
                </Flex>
              </Box>

              <TabPanels>
                <TabPanel>
                  <CategoriesPanel />
                </TabPanel>
                <TabPanel>
                  <TagsPanel />
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
